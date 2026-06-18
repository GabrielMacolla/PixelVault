package com.pixelvault.dto;

import java.math.BigDecimal;
import java.util.List;

public class PedidoRequest {

    private String emailUsuario;
    private List<ItemRequest> itens;
    private BigDecimal total;

    public String getEmailUsuario() { return emailUsuario; }
    public void setEmailUsuario(String emailUsuario) { this.emailUsuario = emailUsuario; }
    public List<ItemRequest> getItens() { return itens; }
    public void setItens(List<ItemRequest> itens) { this.itens = itens; }
    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }

    public static class ItemRequest {
        private Long jogoId;
        private Long bundleId;
        private Integer quantidade;
        private BigDecimal precoUnitario;

        public Long getJogoId() { return jogoId; }
        public void setJogoId(Long jogoId) { this.jogoId = jogoId; }
        public Long getBundleId() { return bundleId; }
        public void setBundleId(Long bundleId) { this.bundleId = bundleId; }
        public Integer getQuantidade() { return quantidade; }
        public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }
        public BigDecimal getPrecoUnitario() { return precoUnitario; }
        public void setPrecoUnitario(BigDecimal precoUnitario) { this.precoUnitario = precoUnitario; }
    }
}
