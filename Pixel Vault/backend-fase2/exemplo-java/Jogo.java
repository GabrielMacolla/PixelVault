package com.pixelvault.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

/**
 * Entidade JPA que mapeia a tabela "jogo".
 * Cada anotacao diz ao Hibernate como transformar este objeto Java
 * em linhas/colunas do banco (Object-Relational Mapping).
 */
@Entity
@Table(name = "jogo")
public class Jogo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // = AUTO_INCREMENT do MySQL
    private Long id;

    @Column(nullable = false, length = 150)
    private String nome;

    @Column(length = 500)
    private String descricao;

    private Integer ano;

    @Column(nullable = false)
    private BigDecimal preco; // BigDecimal para dinheiro (nunca double!)

    @Column(name = "preco_promocional")
    private BigDecimal precoPromocional; // null = sem promocao

    @Column(name = "capa_cor", length = 7)
    private String capaCor;

    // Muitos jogos pertencem a um genero (lado "dono" da FK).
    @ManyToOne(optional = false)
    @JoinColumn(name = "genero_id")
    private Genero genero;

    @ManyToOne(optional = false)
    @JoinColumn(name = "plataforma_id")
    private Plataforma plataforma;

    // Construtor vazio exigido pelo JPA
    public Jogo() {}

    // Getters e setters (encurtados aqui; gere com a IDE: Alt+Insert)
    public Long getId() { return id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public BigDecimal getPreco() { return preco; }
    public void setPreco(BigDecimal preco) { this.preco = preco; }
    public BigDecimal getPrecoPromocional() { return precoPromocional; }
    public void setPrecoPromocional(BigDecimal p) { this.precoPromocional = p; }
    public Genero getGenero() { return genero; }
    public void setGenero(Genero genero) { this.genero = genero; }
    public Plataforma getPlataforma() { return plataforma; }
    public void setPlataforma(Plataforma plataforma) { this.plataforma = plataforma; }
    // ... demais getters/setters
}
