/* =====================================================================
   auth.js — autenticacao via API REST (Fase 2)
   Cadastro e login agora chamam o back-end Java.
   A sessao do usuario logado ainda fica no localStorage.
   ===================================================================== */

const API_URL = "http://localhost:8080";

const Auth = {
  CHAVE_SESSAO: "pv_sessao",

  async registrar(dados) {
    try {
      const resp = await fetch(API_URL + "/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });
      const json = await resp.json();
      if (!resp.ok) return { ok: false, erro: json.erro };
      return { ok: true };
    } catch (erro) {
      return { ok: false, erro: "Erro ao conectar com o servidor." };
    }
  },

  async login(email, senha) {
    try {
      const resp = await fetch(API_URL + "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const json = await resp.json();
      if (!resp.ok) return { ok: false, erro: json.erro };
      localStorage.setItem(this.CHAVE_SESSAO, JSON.stringify({ nome: json.nome, email: json.email }));
      return { ok: true };
    } catch (erro) {
      return { ok: false, erro: "Erro ao conectar com o servidor." };
    }
  },

  logout() {
    localStorage.removeItem(this.CHAVE_SESSAO);
  },

  usuarioAtual() {
    return JSON.parse(localStorage.getItem(this.CHAVE_SESSAO) || "null");
  },

  estaLogado() {
    return this.usuarioAtual() !== null;
  },
};
