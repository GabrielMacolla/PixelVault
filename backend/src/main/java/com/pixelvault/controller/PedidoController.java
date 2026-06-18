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
        Optional<Usuario> optUsuario = usuarioRepository.findByEmail(request.getEmailUsuario());
        if (optUsuario.isEmpty()) {
            Map<String, Object> erro = new LinkedHashMap<>();
            erro.put("erro", "Usuario nao encontrado.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(erro);
        }

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
                jogoRepository.findById(itemReq.getJogoId()).ifPresent(item::setJogo);
            } else if (itemReq.getBundleId() != null) {
                bundleRepository.findById(itemReq.getBundleId()).ifPresent(item::setBundle);
            }

            itens.add(item);
        }

        pedido.setItens(itens);
        Pedido salvo = pedidoRepository.save(pedido);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("id", salvo.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
