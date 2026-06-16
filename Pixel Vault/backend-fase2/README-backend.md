# Pixel Vault — Fase 2: Back-end Java + Banco de Dados

Esta pasta **documenta** como evoluir a POC (Fase 1, só front-end) para uma
aplicação completa com banco de dados em **Java (Spring Boot)** e **MySQL 8**.
Aqui não há uma aplicação Java rodando — são os artefatos e o passo a passo.

## 1. Modelo de dados (diagrama ER textual)

```
  genero (1) ──< (N) jogo (N) >── (1) plataforma
                     │
                     │ (N)
                     ▼
                bundle_jogo  (tabela de ligação N:N)
                     ▲
                     │ (N)
                  bundle

  usuario (1) ──< (N) pedido (1) ──< (N) item_pedido >── (1) jogo
                                                      └── (1) bundle
```

| Tabela        | Papel                                                        |
|---------------|-------------------------------------------------------------|
| `genero`      | Categorias de gênero (Ação, RPG...). 5 registros.           |
| `plataforma`  | Consoles (SNES, PlayStation...). 5 registros.               |
| `jogo`        | Produto base. FK para genero e plataforma. 25 registros.    |
| `bundle`      | Pacote de jogos com preço próprio. 5 registros.             |
| `bundle_jogo` | Liga bundle ↔ jogo (N:N).                                   |
| `usuario`     | Cadastro (CPF/email únicos, senha em hash).                 |
| `pedido`      | Compra finalizada de um usuário.                            |
| `item_pedido` | Linhas do pedido (jogo **ou** bundle + quantidade).         |

> **Promoções e Bundles** não viram, cada um, uma tabela à parte:
> - *Promoção* = qualquer `jogo`/`bundle` com `preco_promocional` preenchido (uma **consulta**).
> - *Bundle* = a tabela `bundle`. As "abas" do front-end viram filtros/endpoints.

## 2. Como montar o banco (passo a passo)

1. Instale o **MySQL 8** e o **MySQL Workbench**.
2. Abra o Workbench e rode, **nesta ordem**:
   - `schema.sql` → cria o banco `pixel_vault` e todas as tabelas.
   - `seed.sql`   → popula com os 25 jogos, 5 bundles, gêneros e plataformas.
3. Confira: `SELECT g.nome, COUNT(*) FROM jogo j JOIN genero g ON g.id=j.genero_id GROUP BY g.nome;`
   → deve mostrar **5 jogos por gênero**.

## 3. Como montar o projeto Java (Spring Boot)

1. Gere o esqueleto em <https://start.spring.io> com as dependências:
   **Spring Web**, **Spring Data JPA**, **MySQL Driver**.
2. Estrutura sugerida:
   ```
   src/main/java/com/pixelvault/
     ├─ model/        Jogo.java, Genero.java, Plataforma.java, Bundle.java,
     │                Usuario.java, Pedido.java, ItemPedido.java   (@Entity)
     ├─ repository/   JogoRepository.java, ...                     (interfaces)
     └─ controller/   JogoController.java, ...                     (@RestController)
   ```
   Veja exemplos prontos em `exemplo-java/` (Jogo, JogoRepository, JogoController).
3. Configure o acesso ao banco em `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/pixel_vault
   spring.datasource.username=root
   spring.datasource.password=SUA_SENHA
   spring.jpa.hibernate.ddl-auto=validate   # use 'update' p/ deixar o JPA criar as tabelas
   spring.jpa.show-sql=true
   ```
4. **Seed automático (opcional):** copie `schema.sql` e `seed.sql` para
   `src/main/resources/`. Com `spring.sql.init.mode=always`, o Spring Boot
   roda os dois ao subir. (Alternativa em código: um `CommandLineRunner` que
   salva os dados via `repository.save(...)` se a tabela estiver vazia.)
5. Rode: `./mvnw spring-boot:run`. A API sobe em `http://localhost:8080`.

## 4. Conectando o front-end (Fase 1) à API (Fase 2)

A Fase 1 foi desenhada para essa troca ser **mínima**: todo o acesso a dados
está isolado em [`js/data.js`](../js/data.js). Basta trocar o `fetch` do arquivo
local por uma chamada à API:

```js
// ANTES (Fase 1 - arquivo local)
const resp = await fetch("data/games.json");

// DEPOIS (Fase 2 - API Java)
const resp = await fetch("http://localhost:8080/api/jogos");
```

Mapa de substituição:

| Front-end hoje (mock)             | Vira na Fase 2 (endpoint REST)              |
|-----------------------------------|---------------------------------------------|
| `data/games.json`                 | `GET /api/jogos`                            |
| busca por nome (filtro local)     | `GET /api/jogos?busca=mario`                |
| aba Promoções                     | `GET /api/jogos/promocoes`                  |
| aba por gênero                    | `GET /api/jogos/genero/{nome}`              |
| `localStorage` de usuários        | `POST /api/usuarios` + `POST /api/auth/login` |
| carrinho → checkout simulado      | `POST /api/pedidos` (grava pedido + itens)  |

> **Segurança (nota de estudo):** na Fase 2, a senha vai num `POST` HTTPS e é
> guardada como **hash BCrypt** (Spring Security), nunca em texto puro como na
> POC. O login passa a devolver um **token JWT** enviado nos cabeçalhos das
> requisições seguintes.
