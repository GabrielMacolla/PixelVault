/* =====================================================================
   cart.js — carrinho de compras
   Estado persistido no localStorage como [{id, qtd}, ...].
   Os dados completos do produto vem de Dados.porId(id), evitando
   guardar preco duplicado (que poderia ficar desatualizado).
   ===================================================================== */

const Carrinho = {
  CHAVE: "pv_carrinho",
  itens: [], // [{ id, qtd }]

  carregar() {
    this.itens = JSON.parse(localStorage.getItem(this.CHAVE) || "[]");
  },
  _salvar() {
    localStorage.setItem(this.CHAVE, JSON.stringify(this.itens));
  },

  adicionar(id) {
    const existente = this.itens.find((i) => i.id === id);
    if (existente) existente.qtd++;
    else this.itens.push({ id, qtd: 1 });
    this._salvar();
  },

  alterarQtd(id, delta) {
    const item = this.itens.find((i) => i.id === id);
    if (!item) return;
    item.qtd += delta;
    if (item.qtd <= 0) this.remover(id);
    else this._salvar();
  },

  remover(id) {
    this.itens = this.itens.filter((i) => i.id !== id);
    this._salvar();
  },

  limpar() {
    this.itens = [];
    this._salvar();
  },

  /* Preco efetivo de um produto (promocional quando houver). */
  precoDe(produto) {
    return produto.precoPromocional ?? produto.preco;
  },

  quantidadeTotal() {
    return this.itens.reduce((soma, i) => soma + i.qtd, 0);
  },

  total() {
    return this.itens.reduce((soma, i) => {
      const p = Dados.porId(i.id);
      return p ? soma + this.precoDe(p) * i.qtd : soma;
    }, 0);
  },
};
