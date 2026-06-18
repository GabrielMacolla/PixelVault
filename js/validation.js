/* =====================================================================
   validation.js
   Funcoes puras de validacao usadas no cadastro de usuario.
   Sao "puras" (entram dados, saem true/false ou string de erro) para
   ficarem faceis de testar e de reaproveitar no back-end mentalmente.
   ===================================================================== */

const Validacao = {
  /* Nome completo: exige pelo menos nome + sobrenome (2 palavras). */
  nomeCompleto(valor) {
    const partes = valor.trim().split(/\s+/);
    if (partes.length < 2) return "Informe nome e sobrenome.";
    if (valor.trim().length < 5) return "Nome muito curto.";
    return null; // null = sem erro
  },

  /* E-mail: regex simples e suficiente para uma POC. */
  email(valor) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(valor.trim()) ? null : "E-mail invalido.";
  },

  /* Telefone BR: aceita (00) 00000-0000 ou (00) 0000-0000. */
  telefone(valor) {
    const re = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    return re.test(valor.trim()) ? null : "Telefone invalido. Use (00) 00000-0000.";
  },

  /* Senha: regra basica de tamanho minimo. */
  senha(valor) {
    if (valor.length < 6) return "A senha precisa de ao menos 6 caracteres.";
    return null;
  },

  /* CPF: valida formato E os dois digitos verificadores. */
  cpf(valor) {
    const cpf = valor.replace(/\D/g, ""); // mantem apenas numeros
    if (cpf.length !== 11) return "CPF deve ter 11 digitos.";
    // Rejeita sequencias iguais (000..., 111...), que passam na conta mas sao invalidas.
    if (/^(\d)\1{10}$/.test(cpf)) return "CPF invalido.";

    // Calculo dos digitos verificadores (algoritmo oficial da Receita).
    const calcDigito = (qtd) => {
      let soma = 0;
      for (let i = 0; i < qtd; i++) {
        soma += parseInt(cpf[i], 10) * (qtd + 1 - i);
      }
      const resto = (soma * 10) % 11;
      return resto === 10 ? 0 : resto;
    };

    if (calcDigito(9) !== parseInt(cpf[9], 10)) return "CPF invalido.";
    if (calcDigito(10) !== parseInt(cpf[10], 10)) return "CPF invalido.";
    return null;
  },
};

/* ---------- Mascaras de digitacao (formatam enquanto o usuario digita) ---------- */
const Mascara = {
  cpf(valor) {
    return valor
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  },
  telefone(valor) {
    return valor
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(\d{4})(\d)$/, "$1-$2"); // ajuste para fixos de 8 digitos
  },
};
