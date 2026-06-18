package com.pixelvault.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "jogo")
public class Jogo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String nome;

    @Column(length = 500)
    private String descricao;

    private Integer ano;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal preco;

    @Column(name = "preco_promocional", precision = 10, scale = 2)
    private BigDecimal precoPromocional;

    @Column(name = "capa_cor", length = 7)
    private String capaCor;

    @Column(columnDefinition = "INT DEFAULT 10")
    private Integer estoque = 10;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "genero_id", nullable = false)
    private Genero genero;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "plataforma_id", nullable = false)
    private Plataforma plataforma;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public Integer getAno() { return ano; }
    public void setAno(Integer ano) { this.ano = ano; }
    public BigDecimal getPreco() { return preco; }
    public void setPreco(BigDecimal preco) { this.preco = preco; }
    public BigDecimal getPrecoPromocional() { return precoPromocional; }
    public void setPrecoPromocional(BigDecimal precoPromocional) { this.precoPromocional = precoPromocional; }
    public String getCapaCor() { return capaCor; }
    public void setCapaCor(String capaCor) { this.capaCor = capaCor; }
    public Genero getGenero() { return genero; }
    public void setGenero(Genero genero) { this.genero = genero; }
    public Plataforma getPlataforma() { return plataforma; }
    public void setPlataforma(Plataforma plataforma) { this.plataforma = plataforma; }
    public Integer getEstoque() { return estoque; }
    public void setEstoque(Integer estoque) { this.estoque = estoque; }
}
