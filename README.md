# 🎮 Pixel Vault

Loja online (POC acadêmica) de jogos retro e atuais, com tema **pixel art**,
modo **claro/escuro**, carrinho, login/cadastro com validações e catálogo
filtrável por gênero, console, promoções e bundles.

Projeto em **duas fases**:
- **Fase 1 (este código):** front-end em HTML + CSS + JavaScript puro, com dados
  mockados em JSON e estado no `localStorage`. Sem pagamento/envio reais.
- **Fase 2 (documentada):** back-end em **Java (Spring Boot)** + **MySQL**.
  Ver [`backend-fase2/`](backend-fase2/).

## 📁 Estrutura

```
Pixel Vault/
├─ index.html              # Página única (catálogo + modais)
├─ css/
│  └─ styles.css           # Tema retro + variáveis claro/escuro + responsivo
├─ js/
│  ├─ validation.js        # Validações puras (CPF c/ dígitos, e-mail, telefone) + máscaras
│  ├─ data.js              # Acesso a dados (DAO mock) — ponto único p/ trocar por API
│  ├─ auth.js              # Login/cadastro simulados (localStorage)
│  ├─ cart.js              # Lógica do carrinho
│  ├─ catalog.js           # Renderização e filtros do catálogo
│  └─ main.js              # Inicialização + eventos da UI (tema, abas, busca, checkout)
├─ data/
│  └─ games.json           # Base mock: 25 jogos (5/gênero, 5/plataforma) + 5 bundles + 5 promoções
├─ backend-fase2/          # Documentação da Fase 2 (Java + BD)
│  ├─ schema.sql           # Criação das tabelas (MySQL)
│  ├─ seed.sql             # Carga inicial (mesmos dados do front)
│  ├─ exemplo-java/        # Entidade JPA, Repository e Controller de exemplo
│  └─ README-backend.md    # Modelo ER + passo a passo + como ligar front↔API
└─ README.md
```

## ▶️ Como rodar (Fase 1)

> ⚠️ **Não abra o `index.html` com duplo clique.** O navegador bloqueia o
> `fetch` do `games.json` em `file://`. Use um servidor local simples:

**Opção A — Python (já vem no Windows/Mac/Linux):**
```bash
cd "Pixel Vault"
python -m http.server 5500
```
Abra <http://localhost:5500> no navegador.

**Opção B — VS Code:** instale a extensão **Live Server** e clique em
*"Go Live"* com o `index.html` aberto.

## ✅ Funcionalidades (Fase 1)

- Catálogo com abas: **Todos, Promoções, Bundles** + gêneros (Ação, RPG, Plataforma, Luta, Corrida).
- Filtro secundário por **console** (SNES, Mega Drive, PlayStation, Switch, PC).
- **Busca** por nome em tempo real (combina com os filtros).
- **Carrinho**: adicionar, alterar quantidade, remover, total — persistido no `localStorage`.
- **Cadastro** com validação campo a campo:
  - Nome completo (nome + sobrenome), e-mail, **CPF com dígitos verificadores**,
    telefone BR `(00) 00000-0000` (com máscara), senha (mín. 6).
- **Login obrigatório** para finalizar a compra (quem não tem conta é levado ao cadastro).
- **Checkout simulado**: tela de "Pedido realizado" com resumo (sem pagamento real).
- **Tema claro/escuro** com botão e persistência.

### Como testar rápido
1. Crie uma conta (use um CPF válido, ex.: gerado por um "gerador de CPF" de estudo).
2. Adicione jogos ao carrinho, abra o carrinho 🛒 e clique em **Finalizar Compra**.

## 🚀 Evolução para a Fase 2

Toda a leitura de dados está isolada em [`js/data.js`](js/data.js). Para integrar
com o Java, troca-se o `fetch("data/games.json")` por `fetch(".../api/jogos")`.
O passo a passo completo (montar o banco, subir o Spring Boot e mapear cada
aba/filtro para um endpoint) está em
[`backend-fase2/README-backend.md`](backend-fase2/README-backend.md).

---
*POC acadêmica — Engenharia da Computação. Sem fins comerciais; nomes de jogos são de seus respectivos donos.*
