-- =====================================================================
-- Pixel Vault — Carga inicial (SEED)
-- =====================================================================
USE pixel_vault;

-- ---------- Generos ----------
INSERT INTO genero (id, nome) VALUES
  (1,'Acao'), (2,'RPG'), (3,'Plataforma'), (4,'Luta'), (5,'Corrida');

-- ---------- Plataformas ----------
INSERT INTO plataforma (id, nome) VALUES
  (1,'SNES'), (2,'Mega Drive'), (3,'PlayStation'), (4,'Nintendo Switch'), (5,'PC');

-- ---------- Jogos ----------
-- Colunas: id, nome, descricao, ano, preco, preco_promocional, capa_cor, genero_id, plataforma_id
INSERT INTO jogo (id,nome,descricao,ano,preco,preco_promocional,capa_cor,genero_id,plataforma_id) VALUES
  (1,'Contra III: The Alien Wars','Run and gun classico.',1992,89.90,NULL,'#e74c3c',1,1),
  (2,'Gunstar Heroes','Tiro frenetico com chefes gigantes.',1993,79.90,49.90,'#c0392b',1,2),
  (3,'Metal Gear Solid','Stealth cinematografico.',1998,99.90,NULL,'#7f8c8d',1,3),
  (4,'Bayonetta 3','Acao estilosa com combos.',2022,299.90,249.90,'#9b59b6',1,4),
  (5,'Doom Eternal','FPS ultrarrapido.',2020,149.90,NULL,'#d35400',1,5),

  (6,'Chrono Trigger','RPG de viagem no tempo.',1995,119.90,89.90,'#2980b9',2,1),
  (7,'Phantasy Star IV','JRPG espacial.',1993,109.90,NULL,'#16a085',2,2),
  (8,'Final Fantasy VII','Aventura epica de Cloud.',1997,99.90,NULL,'#34495e',2,3),
  (9,'Xenoblade Chronicles 3','JRPG de mundo aberto.',2022,299.90,NULL,'#e67e22',2,4),
  (10,'Baldur''s Gate 3','CRPG baseado em D&D 5e.',2023,199.90,159.90,'#8e44ad',2,5),

  (11,'Super Mario World','Plataforma definitivo do SNES.',1990,99.90,NULL,'#f1c40f',3,1),
  (12,'Sonic the Hedgehog 2','Velocidade azul classica.',1992,79.90,39.90,'#2980b9',3,2),
  (13,'Crash Bandicoot','O marsupial do PlayStation.',1996,89.90,NULL,'#e67e22',3,3),
  (14,'Super Mario Odyssey','Aventura 3D com o Cappy.',2017,299.90,NULL,'#e74c3c',3,4),
  (15,'Celeste','Plataforma desafiador.',2018,49.90,29.90,'#1abc9c',3,5),

  (16,'Street Fighter II Turbo','O rei dos jogos de luta.',1992,99.90,NULL,'#c0392b',4,1),
  (17,'Mortal Kombat','Lutas brutais com fatalities.',1992,89.90,NULL,'#f39c12',4,2),
  (18,'Tekken 3','Luta 3D referencia.',1998,89.90,59.90,'#2c3e50',4,3),
  (19,'Super Smash Bros. Ultimate','Todos numa arena.',2018,299.90,NULL,'#e74c3c',4,4),
  (20,'Guilty Gear Strive','Luta 2D anime.',2021,159.90,NULL,'#d35400',4,5),

  (21,'Super Mario Kart','O kart que iniciou a febre.',1992,99.90,NULL,'#27ae60',5,1),
  (22,'Road Rash II','Corrida de motos com pancadaria.',1992,79.90,NULL,'#7f8c8d',5,2),
  (23,'Gran Turismo','O simulador do PlayStation.',1997,89.90,NULL,'#2980b9',5,3),
  (24,'Mario Kart 8 Deluxe','A versao definitiva do kart.',2017,299.90,269.90,'#e74c3c',5,4),
  (25,'Forza Horizon 5','Mundo aberto de corridas.',2021,249.90,NULL,'#16a085',5,5);

-- ---------- Bundles ----------
INSERT INTO bundle (id,nome,descricao,preco,preco_promocional,capa_cor) VALUES
  (101,'Bundle Retro SNES','Contra III + Mario World + Chrono Trigger + Street Fighter II.',408.60,299.90,'#8e44ad'),
  (102,'Bundle Sega Genesis','Gunstar + Sonic 2 + Phantasy Star IV + Mortal Kombat.',359.60,259.90,'#2980b9'),
  (103,'Bundle PlayStation Classics','MGS + FF VII + Crash + Tekken 3 + Gran Turismo.',469.50,349.90,'#34495e'),
  (104,'Bundle Switch Hits','Odyssey + Mario Kart 8 + Smash Ultimate.',899.70,749.90,'#e74c3c'),
  (105,'Bundle PC Master Race','Doom + Baldur''s Gate 3 + Celeste + Forza.',649.60,499.90,'#16a085');

-- ---------- Composicao dos bundles (N:N) ----------
INSERT INTO bundle_jogo (bundle_id, jogo_id) VALUES
  (101,1),(101,11),(101,6),(101,16),
  (102,2),(102,12),(102,7),(102,17),
  (103,3),(103,8),(103,13),(103,18),(103,23),
  (104,14),(104,24),(104,19),
  (105,5),(105,10),(105,15),(105,25);
