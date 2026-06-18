/* =====================================================================
   auth.js — autenticacao SIMULADA (apenas POC)
   Usuarios ficam no localStorage. NUNCA faca isso em producao:
   senhas seriam enviadas a um back-end e guardadas com hash (ex.: BCrypt).

   FASE 2: substituir registrar()/login() por chamadas a API:
       POST /api/usuarios        (cadastro)
       POST /api/auth/login      (retorna um token JWT)
   ===================================================================== */

const Auth = {
  CHAVE_USUARIOS: "pv_usuarios",
  CHAVE_SESSAO: "pv_sessao",

  _lerUsuarios() {
    return JSON.parse(localStorage.getItem(this.CHAVE_USUARIOS) || "[]");
  },
  _salvarUsuarios(lista) {
    localStorage.setItem(this.CHAVE_USUARIOS, JSON.stringify(lista));
  },

  /* Registra um usuario ja validado. Retorna {ok, erro}. */
  registrar(dados) {
    const usuarios = this._lerUsuarios();
    if (usuarios.some((u) => u.email === dados.email)) {
      return { ok: false, erro: "Ja existe uma conta com este e-mail." };
    }
    if (usuarios.some((u) => u.cpf === dados.cpf)) {
      return { ok: false, erro: "Ja existe uma conta com este CPF." };
    }
    usuarios.push(dados);
    this._salvarUsuarios(usuarios);
    return { ok: true };
  },

  /* Faz login. Retorna {ok, erro}. */
  login(email, senha) {
    const usuarios = this._lerUsuarios();
    const u = usuarios.find((x) => x.email === email && x.senha === senha);
    if (!u) return { ok: false, erro: "E-mail ou senha incorretos." };
    localStorage.setItem(this.CHAVE_SESSAO, JSON.stringify({ nome: u.nome, email: u.email }));
    return { ok: true };
  },

  logout() {
    localStorage.removeItem(this.CHAVE_SESSAO);
  },

  /* Retorna o usuario logado ou null. */
  usuarioAtual() {
    return JSON.parse(localStorage.getItem(this.CHAVE_SESSAO) || "null");
  },

  estaLogado() {
    return this.usuarioAtual() !== null;
  },
};
