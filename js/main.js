/* =====================================================================
   main.js — ponto de entrada: inicializa tudo e liga os eventos da UI
   (tema, abas, busca, carrinho, login, registro, checkout).
   ===================================================================== */

document.addEventListener("DOMContentLoaded", async () => {
  // ---------- Inicializacao ----------
  aplicarTemaSalvo();
  Carrinho.carregar();
  await Dados.carregarProdutos();
  Catalogo.aoAdicionar = adicionarAoCarrinho; // injeta callback no catalogo
  Catalogo.renderizar();
  atualizarBadgeCarrinho();
  atualizarAreaUsuario();

  // ================= TEMA (claro/escuro) =================
  document.getElementById("btnTema").addEventListener("click", () => {
    const atual = document.documentElement.getAttribute("data-tema");
    const novo = atual === "escuro" ? "claro" : "escuro";
    document.documentElement.setAttribute("data-tema", novo);
    localStorage.setItem("pv_tema", novo);
    atualizarIconeTema(novo);
  });

  // ================= ABAS / FILTROS =================
  document.querySelectorAll("#abas .aba").forEach((aba) => {
    aba.addEventListener("click", () => {
      document.querySelectorAll("#abas .aba").forEach((a) => a.classList.remove("ativa"));
      aba.classList.add("ativa");
      if (aba.dataset.grupo === "genero") {
        Catalogo.filtroAtual.categoria = "genero";
        Catalogo.filtroAtual.valorCategoria = aba.dataset.filtro;
      } else {
        Catalogo.filtroAtual.categoria = aba.dataset.filtro; // todos | promocoes | bundles
        Catalogo.filtroAtual.valorCategoria = null;
      }
      Catalogo.renderizar();
    });
  });

  document.querySelectorAll("#abasPlataforma .aba").forEach((aba) => {
    aba.addEventListener("click", () => {
      document.querySelectorAll("#abasPlataforma .aba").forEach((a) => a.classList.remove("ativa"));
      aba.classList.add("ativa");
      Catalogo.filtroAtual.plataforma = aba.dataset.filtro;
      Catalogo.renderizar();
    });
  });

  // ================= BUSCA (tempo real) =================
  document.getElementById("campoBusca").addEventListener("input", (e) => {
    Catalogo.filtroAtual.busca = e.target.value;
    Catalogo.renderizar();
  });

  // Logo volta ao inicio
  document.getElementById("btnHome").addEventListener("click", () => location.reload());

  // ================= MODAIS: abrir/fechar genericos =================
  document.querySelectorAll("[data-fechar]").forEach((el) => {
    el.addEventListener("click", () => fecharTodosModais());
  });
  document.querySelectorAll(".modal").forEach((m) => {
    m.addEventListener("click", (e) => { if (e.target === m) fecharTodosModais(); });
  });

  // ================= CARRINHO =================
  document.getElementById("btnCarrinho").addEventListener("click", abrirCarrinho);
  document.getElementById("btnFinalizar").addEventListener("click", finalizarCompra);

  // ================= LOGIN / REGISTRO =================
  document.getElementById("btnLogin").addEventListener("click", () => abrirModal("modalLogin"));
  document.getElementById("btnLogout").addEventListener("click", () => {
    Auth.logout(); atualizarAreaUsuario(); mostrarToast("Voce saiu da conta.");
  });
  document.getElementById("irParaRegistro").addEventListener("click", (e) => {
    e.preventDefault(); fecharTodosModais(); abrirModal("modalRegistro");
  });
  document.getElementById("irParaLogin").addEventListener("click", (e) => {
    e.preventDefault(); fecharTodosModais(); abrirModal("modalLogin");
  });

  document.getElementById("formLogin").addEventListener("submit", tratarLogin);
  document.getElementById("formRegistro").addEventListener("submit", tratarRegistro);

  // Mascaras de CPF e telefone enquanto digita
  const inpCpf = document.querySelector('#formRegistro [name="cpf"]');
  const inpTel = document.querySelector('#formRegistro [name="telefone"]');
  inpCpf.addEventListener("input", () => (inpCpf.value = Mascara.cpf(inpCpf.value)));
  inpTel.addEventListener("input", () => (inpTel.value = Mascara.telefone(inpTel.value)));
});

/* ============================ TEMA ============================ */
function aplicarTemaSalvo() {
  const tema = localStorage.getItem("pv_tema") || "escuro";
  document.documentElement.setAttribute("data-tema", tema);
  atualizarIconeTema(tema);
}
function atualizarIconeTema(tema) {
  document.getElementById("btnTema").textContent = tema === "escuro" ? "🌙" : "☀️";
}

/* ============================ CARRINHO (UI) ============================ */
function adicionarAoCarrinho(id) {
  Carrinho.adicionar(id);
  atualizarBadgeCarrinho();
  const p = Dados.porId(id);
  mostrarToast(`"${p.nome}" adicionado ao carrinho!`);
}

function atualizarBadgeCarrinho() {
  document.getElementById("badgeCarrinho").textContent = Carrinho.quantidadeTotal();
}

function abrirCarrinho() {
  renderizarCarrinho();
  abrirModal("modalCarrinho");
}

function renderizarCarrinho() {
  const lista = document.getElementById("listaCarrinho");
  lista.innerHTML = "";

  if (Carrinho.itens.length === 0) {
    lista.innerHTML = `<p class="carrinho-vazio">Seu carrinho esta vazio.</p>`;
  } else {
    Carrinho.itens.forEach((item) => {
      const p = Dados.porId(item.id);
      const preco = Carrinho.precoDe(p);
      const div = document.createElement("div");
      div.className = "carrinho-item";
      div.innerHTML = `
        <div class="carrinho-item__info">
          <strong>${p.nome}</strong><br />
          <small>${Catalogo._formatarPreco(preco)} cada</small>
        </div>
        <div class="qtd-controle">
          <button data-acao="menos">-</button>
          <span>${item.qtd}</span>
          <button data-acao="mais">+</button>
        </div>`;
      div.querySelector('[data-acao="menos"]').addEventListener("click", () => {
        Carrinho.alterarQtd(item.id, -1); renderizarCarrinho(); atualizarBadgeCarrinho();
      });
      div.querySelector('[data-acao="mais"]').addEventListener("click", () => {
        Carrinho.alterarQtd(item.id, +1); renderizarCarrinho(); atualizarBadgeCarrinho();
      });
      lista.appendChild(div);
    });
  }
  document.getElementById("totalCarrinho").textContent = Catalogo._formatarPreco(Carrinho.total());
}

/* ============================ CHECKOUT ============================ */
function finalizarCompra() {
  if (Carrinho.itens.length === 0) {
    mostrarToast("Adicione itens antes de finalizar.");
    return;
  }
  // Regra de negocio: precisa estar logado para comprar.
  if (!Auth.estaLogado()) {
    fecharTodosModais();
    mostrarToast("Faca login para finalizar a compra.");
    abrirModal("modalLogin");
    return;
  }

  // Monta o resumo do pedido (simulacao — nenhum pagamento real).
  const resumo = document.getElementById("resumoPedido");
  const linhas = Carrinho.itens.map((i) => {
    const p = Dados.porId(i.id);
    return `<div>${i.qtd}x ${p.nome} — ${Catalogo._formatarPreco(Carrinho.precoDe(p) * i.qtd)}</div>`;
  });
  resumo.innerHTML = linhas.join("") +
    `<hr /><strong>Total: ${Catalogo._formatarPreco(Carrinho.total())}</strong>`;

  Carrinho.limpar();
  atualizarBadgeCarrinho();
  fecharTodosModais();
  abrirModal("modalConfirmacao");
}

/* ============================ LOGIN ============================ */
async function tratarLogin(e) {
  e.preventDefault();
  const dados = Object.fromEntries(new FormData(e.target));
  const r = await Auth.login(dados.email.trim(), dados.senha);
  const erro = document.getElementById("erroLogin");
  if (!r.ok) { erro.textContent = r.erro; return; }
  erro.textContent = "";
  e.target.reset();
  fecharTodosModais();
  atualizarAreaUsuario();
  mostrarToast("Bem-vindo de volta!");
}

/* ============================ REGISTRO ============================ */
async function tratarRegistro(e) {
  e.preventDefault();
  const form = e.target;
  const dados = Object.fromEntries(new FormData(form));

  // Limpa erros anteriores
  form.querySelectorAll(".campo-erro").forEach((s) => (s.textContent = ""));

  // Roda todas as validacoes e coleta erros por campo
  const erros = {
    nome: Validacao.nomeCompleto(dados.nome || ""),
    email: Validacao.email(dados.email || ""),
    cpf: Validacao.cpf(dados.cpf || ""),
    telefone: Validacao.telefone(dados.telefone || ""),
    senha: Validacao.senha(dados.senha || ""),
  };

  let temErro = false;
  for (const campo in erros) {
    if (erros[campo]) {
      temErro = true;
      form.querySelector(`[data-erro="${campo}"]`).textContent = erros[campo];
    }
  }
  if (temErro) return;

  // Tudo valido: registra (Auth ainda pode recusar por duplicidade)
  const r = await Auth.registrar({
    nome: dados.nome.trim(),
    email: dados.email.trim(),
    cpf: dados.cpf,
    telefone: dados.telefone,
    senha: dados.senha,
  });
  if (!r.ok) {
    form.querySelector('[data-erro="email"]').textContent = r.erro;
    return;
  }

  // Loga automaticamente apos cadastrar
  await Auth.login(dados.email.trim(), dados.senha);
  form.reset();
  fecharTodosModais();
  atualizarAreaUsuario();
  mostrarToast("Conta criada com sucesso!");
}

/* ============================ AREA DO USUARIO ============================ */
function atualizarAreaUsuario() {
  const u = Auth.usuarioAtual();
  const btnLogin = document.getElementById("btnLogin");
  const box = document.getElementById("usuarioLogado");
  if (u) {
    btnLogin.classList.add("oculto");
    box.classList.remove("oculto");
    document.getElementById("nomeUsuario").textContent = "👾 " + u.nome.split(" ")[0];
  } else {
    btnLogin.classList.remove("oculto");
    box.classList.add("oculto");
  }
}

/* ============================ UTILITARIOS DE UI ============================ */
function abrirModal(id) { document.getElementById(id).classList.remove("oculto"); }
function fecharTodosModais() {
  document.querySelectorAll(".modal").forEach((m) => m.classList.add("oculto"));
}

let _toastTimer = null;
function mostrarToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.remove("oculto");
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => t.classList.add("oculto"), 2500);
}
