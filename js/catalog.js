/* =====================================================================
   catalog.js — renderizacao do catalogo e filtros
   Estado de filtro centralizado em "filtroAtual" para combinar:
   categoria (todos/promocoes/bundles/genero) + plataforma + busca.
   ===================================================================== */

const Catalogo = {
  filtroAtual: { categoria: "todos", valorCategoria: null, plataforma: "todas", busca: "" },

  // Helper para criar elementos sem usar innerHTML com dados (mais seguro/didatico).
  _formatarPreco(v) {
    return "R$ " + v.toFixed(2).replace(".", ",");
  },

  /* Aplica os filtros combinados sobre a lista de produtos. */
  filtrar() {
    const f = this.filtroAtual;
    return Dados.produtos.filter((p) => {
      // 1) Categoria principal
      if (f.categoria === "promocoes" && !p.promocao) return false;
      if (f.categoria === "bundles" && p.tipo !== "bundle") return false;
      if (f.categoria === "genero" && p.genero !== f.valorCategoria) return false;

      // 2) Plataforma (so se aplica a jogos; bundles tem plataforma propria tambem)
      if (f.plataforma !== "todas" && p.plataforma !== f.plataforma) return false;

      // 3) Busca textual por nome
      if (f.busca && !p.nome.toLowerCase().includes(f.busca.toLowerCase())) return false;

      return true;
    });
  },

  /* Desenha os cards na grade. */
  renderizar() {
    const grade = document.getElementById("grade");
    const info = document.getElementById("resultadoInfo");
    const lista = this.filtrar();
    grade.innerHTML = "";

    info.textContent = `${lista.length} item(ns) encontrado(s)`;

    if (lista.length === 0) {
      grade.innerHTML = `<p class="carrinho-vazio">Nenhum jogo encontrado. 🎮</p>`;
      return;
    }

    lista.forEach((p) => grade.appendChild(this._criarCard(p)));
  },

  _criarCard(p) {
    const card = document.createElement("article");
    card.className = "card";

    const preco = p.precoPromocional
      ? `<span class="preco-antigo">${this._formatarPreco(p.preco)}</span>
         <span class="preco-atual">${this._formatarPreco(p.precoPromocional)}</span>`
      : `<span class="preco-atual">${this._formatarPreco(p.preco)}</span>`;

    const tags = [];
    if (p.promocao) tags.push(`<span class="tag tag--promo">PROMO</span>`);
    if (p.tipo === "bundle") tags.push(`<span class="tag tag--bundle">BUNDLE</span>`);
    tags.push(`<span class="tag">${p.plataforma}</span>`);

    const semEstoque = p.estoque !== undefined && p.estoque <= 0;
    const estoqueAviso = p.estoque !== undefined && p.estoque > 0 && p.estoque <= 3
      ? `<p class="card__estoque card__estoque--alerta">⚠️ Últimas ${p.estoque} unidades!</p>`
      : p.estoque !== undefined && p.estoque > 0
        ? `<p class="card__estoque">${p.estoque} em estoque</p>`
        : "";

    const iniciais = p.nome.split(/\s+/).slice(0, 2).map((x) => x[0]).join("").toUpperCase();

    card.innerHTML = `
      <div class="card__capa" style="background:${p.capaCor}">${iniciais}</div>
      <div class="card__corpo">
        <h3 class="card__titulo">${p.nome}</h3>
        <p class="card__meta">${p.genero} • ${p.ano}</p>
        <p class="card__desc">${p.descricao}</p>
        <div class="card__tags">${tags.join("")}</div>
        <div class="card__preco">${preco}</div>
        ${estoqueAviso}
        <button class="btn btn--pixel btn--bloco btn-add" data-id="${p.id}" ${semEstoque ? "disabled" : ""}>
          ${semEstoque ? "Esgotado ❌" : "Adicionar 🛒"}
        </button>
      </div>`;

    if (!semEstoque) {
      card.querySelector(".btn-add").addEventListener("click", () => {
        Catalogo.aoAdicionar(p.id);
      });
    }

    return card;
  },

  // Preenchido por main.js (mantem catalog.js sem conhecer detalhes da UI global).
  aoAdicionar() {},
};
