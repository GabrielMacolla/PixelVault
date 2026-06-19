package com.pixelvault.controller;

import com.pixelvault.dto.ProdutoDTO;
import com.pixelvault.model.Bundle;
import com.pixelvault.model.Jogo;
import com.pixelvault.repository.BundleRepository;
import com.pixelvault.repository.JogoRepository;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/produtos")
@CrossOrigin(origins = "*")
public class ProdutoController {

    private final JogoRepository jogoRepository;
    private final BundleRepository bundleRepository;

    public ProdutoController(JogoRepository jogoRepository, BundleRepository bundleRepository) {
        this.jogoRepository = jogoRepository;
        this.bundleRepository = bundleRepository;
    }

    // GET /api/produtos — retorna jogos + bundles no mesmo formato do games.json
    @GetMapping
    public Map<String, List<ProdutoDTO>> listar() {
        List<ProdutoDTO> produtos = new ArrayList<>();

        // Adiciona os jogos
        for (Jogo jogo : jogoRepository.findAll()) {
            ProdutoDTO dto = new ProdutoDTO();
            dto.setId(jogo.getId());
            dto.setTipo("jogo");
            dto.setNome(jogo.getNome());
            dto.setDescricao(jogo.getDescricao());
            dto.setGenero(jogo.getGenero().getNome());
            dto.setPlataforma(jogo.getPlataforma().getNome());
            dto.setAno(jogo.getAno());
            dto.setPreco(jogo.getPreco());
            dto.setPrecoPromocional(jogo.getPrecoPromocional());
            dto.setPromocao(jogo.getPrecoPromocional() != null);
            dto.setCapaCor(jogo.getCapaCor());
            dto.setEstoque(jogo.getEstoque() != null ? jogo.getEstoque() : 10);
            produtos.add(dto);
        }

        // Adiciona os bundles
        for (Bundle bundle : bundleRepository.findAll()) {
            ProdutoDTO dto = new ProdutoDTO();
            dto.setId(bundle.getId());
            dto.setTipo("bundle");
            dto.setNome(bundle.getNome());
            dto.setDescricao(bundle.getDescricao());
            dto.setGenero("Varios");
            dto.setPreco(bundle.getPreco());
            dto.setPrecoPromocional(bundle.getPrecoPromocional());
            dto.setPromocao(bundle.getPrecoPromocional() != null);
            dto.setCapaCor(bundle.getCapaCor());
            dto.setEstoque(bundle.getEstoque() != null ? bundle.getEstoque() : 5);

            List<Jogo> jogos = bundle.getJogos();
            Integer anoMaisRecente = null;

            for (Jogo j : jogos) {
                if (j.getAno() != null) {
                    if (anoMaisRecente == null || j.getAno() > anoMaisRecente) {
                        anoMaisRecente = j.getAno();
                    }
                }
            }

            if (!jogos.isEmpty()) {
                dto.setPlataforma(jogos.get(0).getPlataforma().getNome());
            }
            dto.setAno(anoMaisRecente);

            produtos.add(dto);
        }

        Map<String, List<ProdutoDTO>> resposta = new HashMap<>();
        resposta.put("produtos", produtos);
        return resposta;
    }
}
