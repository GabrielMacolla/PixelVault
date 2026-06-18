package com.pixelvault.dto;

import java.math.BigDecimal;
import java.util.List;

public class ProdutoDTO {

    private Long id;
    private String tipo;
    private String nome;
    private String descricao;
    private String genero;
    private String plataforma;
    private Integer ano;
    private BigDecimal preco;
    private BigDecimal precoPromocional;
    private boolean promocao;
    private String capaCor;
    private List<Long> itens;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public String getGenero() { return genero; }
    public void setGenero(String genero) { this.genero = genero; }
    public String getPlataforma() { return plataforma; }
    public void setPlataforma(String plataforma) { this.plataforma = plataforma; }
    public Integer getAno() { return ano; }
    public void setAno(Integer ano) { this.ano = ano; }
    public BigDecimal getPreco() { return preco; }
    public void setPreco(BigDecimal preco) { this.preco = preco; }
    public BigDecimal getPrecoPromocional() { return precoPromocional; }
    public void setPrecoPromocional(BigDecimal precoPromocional) { this.precoPromocional = precoPromocional; }
    public boolean isPromocao() { return promocao; }
    public void setPromocao(boolean promocao) { this.promocao = promocao; }
    public String getCapaCor() { return capaCor; }
    public void setCapaCor(String capaCor) { this.capaCor = capaCor; }
    public List<Long> getItens() { return itens; }
    public void setItens(List<Long> itens) { this.itens = itens; }
}
