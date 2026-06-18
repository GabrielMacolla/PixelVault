package com.pixelvault.repository;

import com.pixelvault.model.Jogo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

/**
 * Repositorio Spring Data JPA.
 * So de estender JpaRepository ja ganhamos findAll(), findById(),
 * save(), deleteById()... sem escrever SQL.
 *
 * Os metodos abaixo sao "query methods": o Spring le o NOME do metodo
 * e gera a consulta automaticamente.
 */
public interface JogoRepository extends JpaRepository<Jogo, Long> {

    // SELECT * FROM jogo WHERE nome LIKE %termo% (busca do front-end)
    List<Jogo> findByNomeContainingIgnoreCase(String nome);

    // Aba de promocoes: jogos com preco promocional preenchido
    List<Jogo> findByPrecoPromocionalIsNotNull();

    // Filtro por genero e por plataforma (abas do catalogo)
    List<Jogo> findByGeneroNome(String generoNome);
    List<Jogo> findByPlataformaNome(String plataformaNome);
}
