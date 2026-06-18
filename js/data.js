/* =====================================================================
   data.js — camada de acesso a dados
   FASE 2: agora busca os produtos da API Java (Spring Boot).
   Se o back-end nao estiver rodando, troca a URL abaixo pelo arquivo local:
       const resp = await fetch("data/games.json");
   ===================================================================== */

const API_URL = "http://localhost:8080";

const Dados = {
  produtos: [],

  async carregarProdutos() {
    try {
      const resp = await fetch(API_URL + "/api/produtos");
      if (!resp.ok) throw new Error("HTTP " + resp.status);
      const json = await resp.json();
      this.produtos = json.produtos;
      return this.produtos;
    } catch (erro) {
      console.error("Falha ao carregar produtos da API:", erro);
      alert(
        "Nao foi possivel conectar ao servidor.\n" +
        "Verifique se o Spring Boot esta rodando em localhost:8080."
      );
      return [];
    }
  },

  porId(id) {
    return this.produtos.find((p) => p.id === id);
  },
};
