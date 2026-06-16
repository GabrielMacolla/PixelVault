-- =====================================================================
-- Pixel Vault — FASE 2 — Criacao do banco de dados
-- SGBD escolhido: MySQL 8.
-- Justificativa: e gratuito, leve, com integracao trivial ao Spring Boot,
-- amplamente usado no mercado e em disciplinas de faculdade, e o
-- MySQL Workbench facilita visualizar o modelo ER. PostgreSQL serviria
-- igualmente; a sintaxe abaixo muda pouco (ver comentarios).
-- =====================================================================

CREATE DATABASE IF NOT EXISTS pixel_vault
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pixel_vault;

-- ---------- Tabelas de apoio (categorias) ----------
CREATE TABLE genero (
  id   INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE plataforma (
  id   INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(50) NOT NULL UNIQUE
);

-- ---------- Usuario ----------
-- CPF e e-mail sao UNIQUE (mesma regra do front-end).
-- senha_hash: na pratica guardamos o hash (BCrypt), nunca a senha pura.
CREATE TABLE usuario (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  nome        VARCHAR(120) NOT NULL,
  email       VARCHAR(120) NOT NULL UNIQUE,
  cpf         CHAR(11)     NOT NULL UNIQUE,   -- guardar so digitos
  telefone    VARCHAR(20)  NOT NULL,
  senha_hash  VARCHAR(100) NOT NULL,
  criado_em   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------- Jogo (produto base) ----------
CREATE TABLE jogo (
  id                BIGINT AUTO_INCREMENT PRIMARY KEY,
  nome              VARCHAR(150) NOT NULL,
  descricao         VARCHAR(500),
  ano               INT,
  preco             DECIMAL(10,2) NOT NULL,
  preco_promocional DECIMAL(10,2),            -- NULL = sem promocao
  capa_cor          VARCHAR(7),               -- placeholder retro (#rrggbb)
  genero_id         INT NOT NULL,
  plataforma_id     INT NOT NULL,
  CONSTRAINT fk_jogo_genero     FOREIGN KEY (genero_id)     REFERENCES genero(id),
  CONSTRAINT fk_jogo_plataforma FOREIGN KEY (plataforma_id) REFERENCES plataforma(id)
);

-- A "aba de promocoes" e uma CONSULTA, nao uma tabela:
--   SELECT * FROM jogo WHERE preco_promocional IS NOT NULL;

-- ---------- Bundle (pacote de jogos) ----------
CREATE TABLE bundle (
  id                BIGINT AUTO_INCREMENT PRIMARY KEY,
  nome              VARCHAR(150) NOT NULL,
  descricao         VARCHAR(500),
  preco             DECIMAL(10,2) NOT NULL,
  preco_promocional DECIMAL(10,2),
  capa_cor          VARCHAR(7)
);

-- Relacao N:N entre bundle e jogo (um bundle tem varios jogos;
-- um jogo pode estar em varios bundles).
CREATE TABLE bundle_jogo (
  bundle_id BIGINT NOT NULL,
  jogo_id   BIGINT NOT NULL,
  PRIMARY KEY (bundle_id, jogo_id),
  CONSTRAINT fk_bj_bundle FOREIGN KEY (bundle_id) REFERENCES bundle(id) ON DELETE CASCADE,
  CONSTRAINT fk_bj_jogo   FOREIGN KEY (jogo_id)   REFERENCES jogo(id)
);

-- ---------- Pedido e itens (carrinho finalizado) ----------
CREATE TABLE pedido (
  id         BIGINT AUTO_INCREMENT PRIMARY KEY,
  usuario_id BIGINT NOT NULL,
  data_hora  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total      DECIMAL(10,2) NOT NULL,
  CONSTRAINT fk_pedido_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

-- item_pedido referencia jogo OU bundle (um dos dois preenchido).
CREATE TABLE item_pedido (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  pedido_id     BIGINT NOT NULL,
  jogo_id       BIGINT,
  bundle_id     BIGINT,
  quantidade    INT NOT NULL,
  preco_unitario DECIMAL(10,2) NOT NULL,  -- "congela" o preco no momento da compra
  CONSTRAINT fk_item_pedido FOREIGN KEY (pedido_id) REFERENCES pedido(id) ON DELETE CASCADE,
  CONSTRAINT fk_item_jogo   FOREIGN KEY (jogo_id)   REFERENCES jogo(id),
  CONSTRAINT fk_item_bundle FOREIGN KEY (bundle_id) REFERENCES bundle(id)
);

-- NOTA (PostgreSQL): troque AUTO_INCREMENT por SERIAL/BIGSERIAL e remova
-- o bloco CHARACTER SET; o restante e praticamente identico.
