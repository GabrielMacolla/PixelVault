/* =====================================================================
   data.js — camada de acesso a dados (DAO mockado)
   Hoje le de data/games.json. Na FASE 2, basta trocar o corpo de
   carregarProdutos() por uma chamada fetch() a API REST em Java:

       const resp = await fetch("http://localhost:8080/api/produtos");
       return await resp.json();

   O resto do front-end nao precisa mudar, pois so depende desta funcao.
   ===================================================================== */

const Dados = {
  produtos: [],

  /* Carrega o catalogo. Retorna uma Promise com a lista de produtos. */
  async carregarProdutos() {
    try {
      const resp = await fetch("data/games.json");
      if (!resp.ok) throw new Error("HTTP " + resp.status);
      const json = await resp.json();
      this.produtos = json.produtos;
      return this.produtos;
    } catch (erro) {
      // Causa comum: abrir o index.html via file:// (fetch bloqueado).
      // Veja o README: rode um servidor local (ex.: python -m http.server).
      console.error("Falha ao carregar games.json:", erro);
      alert(
        "Nao foi possivel carregar os jogos.\n" +
        "Abra o projeto por um servidor local (veja o README)."
      );
      return [];
    }
  },

  /* Busca um produto por id (usado pelo carrinho). */
  porId(id) {
    return this.produtos.find((p) => p.id === id);
  },
};
