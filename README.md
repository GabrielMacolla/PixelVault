# Pixel Vault

> Loja online de jogos retro e atuais com tema pixel art — projeto acadêmico de Engenharia da Computação.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Java](https://img.shields.io/badge/Java_17-ED8B00?style=flat&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot_3.3-6DB33F?style=flat&logo=springboot&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white)

---

## Sobre o Projeto

Pixel Vault é uma SPA (Single Page Application) de e-commerce de jogos desenvolvida em duas fases:

| Fase | Descrição | Status |
|------|-----------|--------|
| **1 — Frontend** | HTML + CSS + JS puro, dados mockados em JSON, estado no `localStorage` | ✅ Concluída |
| **2 — Backend** | API REST em Java/Spring Boot + banco de dados MySQL | ✅ Concluída |

---

## Funcionalidades

- **Catálogo completo** com abas: Todos, Promoções e Bundles
- **Filtros** por gênero (Ação, RPG, Plataforma, Luta, Corrida) e console (SNES, Mega Drive, PlayStation, Switch, PC)
- **Busca em tempo real** por nome, combinada com os filtros ativos
- **Carrinho de compras** com controle de quantidade e persistência via `localStorage`
- **Cadastro de usuário** com validações:
  - Nome completo, e-mail, CPF (com verificação dos dígitos), telefone com máscara `(00) 00000-0000`, senha mínima de 6 caracteres
- **Login obrigatório** para finalizar compra, com redirecionamento automático ao cadastro
- **Checkout simulado** com resumo do pedido
- **Tema claro/escuro** com alternância por botão e persistência da preferência

---

## Tecnologias

### Frontend
- HTML5, CSS3, JavaScript (ES6+) — sem frameworks
- Dados mockados em `data/games.json` (25 jogos + 5 bundles + 5 promoções)

### Backend
- Java 17
- Spring Boot 3.3.5 (Web, Data JPA)
- MySQL 8+ com conector oficial
- Maven

---

## Estrutura do Projeto

```
Pixel Vault/
├── index.html                  # SPA principal
├── css/
│   └── styles.css              # Tema retro, variáveis claro/escuro, responsivo
├── js/
│   ├── validation.js           # Validações de CPF, e-mail, telefone e máscaras
│   ├── data.js                 # Camada de acesso a dados (mock → API)
│   ├── auth.js                 # Login e cadastro
│   ├── cart.js                 # Lógica do carrinho
│   ├── catalog.js              # Renderização e filtros do catálogo
│   └── main.js                 # Inicialização e eventos da UI
├── data/
│   └── games.json              # Base mock de produtos
├── backend/                    # API REST — Spring Boot
│   ├── pom.xml
│   └── src/main/java/com/pixelvault/
│       ├── controller/         # AuthController, ProdutoController, PedidoController
│       ├── model/              # Entidades JPA (Jogo, Bundle, Usuario, Pedido...)
│       ├── repository/         # Interfaces Spring Data JPA
│       ├── dto/                # DTOs de requisição e resposta
│       └── config/             # SecurityConfig (CORS)
└── README.md
```

---

## Como Rodar

### Fase 1 — Frontend (sem backend)

> **Não abra o `index.html` com duplo clique.** O navegador bloqueia o `fetch` de arquivos locais via `file://`. Use um servidor local:

**Opção A — Python:**
```bash
cd "Pixel Vault"
python -m http.server 5500
```
Acesse: [http://localhost:5500](http://localhost:5500)

**Opção B — VS Code:** instale a extensão **Live Server** e clique em *Go Live* com o `index.html` aberto.

---

### Fase 2 — Backend (Spring Boot + MySQL)

#### Pré-requisitos
- Java 17+
- Maven 3.8+
- MySQL 8+ rodando localmente

#### 1. Criar o banco de dados
```sql
CREATE DATABASE pixel_vault;
```

#### 2. Configurar credenciais

Edite [backend/src/main/resources/application.properties](backend/src/main/resources/application.properties):
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/pixel_vault
spring.datasource.username=root
spring.datasource.password=SUA_SENHA
```

#### 3. Subir a API
```bash
cd backend
mvn spring-boot:run
```

A API estará disponível em `http://localhost:8080`.

#### 4. Conectar o frontend

Em [js/data.js](js/data.js), substitua o `fetch` local pela URL da API:
```js
// De:
fetch("data/games.json")
// Para:
fetch("http://localhost:8080/api/produtos")
```

---

## Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/produtos` | Lista todos os jogos e bundles |
| `POST` | `/api/auth/login` | Autenticação de usuário |
| `POST` | `/api/usuarios` | Cadastro de novo usuário |
| `POST` | `/api/pedidos` | Criação de pedido (com verificação de estoque) |

---

## Testando Rapidamente

1. Inicie o frontend com Live Server ou Python.
2. Crie uma conta com um CPF válido (use um gerador de CPF para fins de estudo).
3. Adicione jogos ao carrinho e clique em **Finalizar Compra**.

---
