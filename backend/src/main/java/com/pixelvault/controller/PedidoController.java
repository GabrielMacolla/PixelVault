package com.pixelvault.controller;

import com.pixelvault.dto.PedidoRequest;
import com.pixelvault.model.*;
import com.pixelvault.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "*")
public class PedidoController {

    private final PedidoRepository pedidoRepository;
    private final UsuarioRepository usuarioRepository;
    private final JogoRepository jogoRepository;
    private final BundleRepository bundleRepository;

    public PedidoController(PedidoRepository pedidoRepository, UsuarioRepository usuarioRepository,
                             JogoRepository jogoRepository, BundleRepository bundleRepository) {
        this.pedidoRepository = pedidoRepository;
        this.usuarioRepository = usuarioRepository;
        this.jogoRepository = jogoRepository;
        this.bundleRepository = bundleRepository;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> criar(@RequestBody PedidoRequest request) {
        Map<String, Object> resposta = new HashMap<>();

        // Verifica se o usuario existe
        Optional<Usuario> optUsuario = usuarioRepository.findByEmail(request.getEmailUsuario());
        if (optUsuario.isEmpty()) {
            resposta.put("erro", "Usuario nao encontrado.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(resposta);
        }

        // 1. Verifica estoque de todos os itens antes de confirmar
        for (PedidoRequest.ItemRequest itemReq : request.getItens()) {
            if (itemReq.getJogoId() != null) {
                Optional<Jogo> optJogo = jogoRepository.findById(itemReq.getJogoId());
                if (optJogo.isEmpty()) {
                    resposta.put("erro", "Jogo nao encontrado: ID " + itemReq.getJogoId());
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(resposta);
                }
                Jogo jogo = optJogo.get();
                int estoqueAtual = jogo.getEstoque() != null ? jogo.getEstoque() : 0;
                if (estoqueAtual < itemReq.getQuantidade()) {
                    resposta.put("erro", "Estoque insuficiente para: " + jogo.getNome()
                        + " (disponivel: " + estoqueAtual + ")");
                    return ResponseEntity.status(HttpStatus.CONFLICT).body(resposta);
                }
            } else if (itemReq.getBundleId() != null) {
                Optional<Bundle> optBundle = bundleRepository.findById(itemReq.getBundleId());
                if (optBundle.isEmpty()) {
                    resposta.put("erro", "Bundle nao encontrado: ID " + itemReq.getBundleId());
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(resposta);
                }
                Bundle bundle = optBundle.get();
                int estoqueAtual = bundle.getEstoque() != null ? bundle.getEstoque() : 0;
                if (estoqueAtual < itemReq.getQuantidade()) {
                    resposta.put("erro", "Estoque insuficiente para: " + bundle.getNome()
                        + " (disponivel: " + estoqueAtual + ")");
                    return ResponseEntity.status(HttpStatus.CONFLICT).body(resposta);
                }
            }
        }

        // 2. Cria o pedido e decrementa o estoque
        Pedido pedido = new Pedido();
        pedido.setUsuario(optUsuario.get());
        pedido.setDataHora(LocalDateTime.now());
        pedido.setTotal(request.getTotal());

        List<ItemPedido> itens = new ArrayList<>();
        for (PedidoRequest.ItemRequest itemReq : request.getItens()) {
            ItemPedido item = new ItemPedido();
            item.setPedido(pedido);
            item.setQuantidade(itemReq.getQuantidade());
            item.setPrecoUnitario(itemReq.getPrecoUnitario());

            if (itemReq.getJogoId() != null) {
                Jogo jogo = jogoRepository.findById(itemReq.getJogoId()).get();
                jogo.setEstoque(jogo.getEstoque() - itemReq.getQuantidade());
                jogoRepository.save(jogo);
                item.setJogo(jogo);
            } else if (itemReq.getBundleId() != null) {
                Bundle bundle = bundleRepository.findById(itemReq.getBundleId()).get();
                bundle.setEstoque(bundle.getEstoque() - itemReq.getQuantidade());
                bundleRepository.save(bundle);
                item.setBundle(bundle);
            }

            itens.add(item);
        }

        pedido.setItens(itens);
        Pedido salvo = pedidoRepository.save(pedido);

        resposta.put("id", salvo.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(resposta);
    }
}
