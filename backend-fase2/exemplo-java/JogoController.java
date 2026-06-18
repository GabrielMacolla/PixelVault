package com.pixelvault.controller;

import com.pixelvault.model.Jogo;
import com.pixelvault.repository.JogoRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * Controller REST: expoe os jogos como JSON em /api/jogos.
 * E ESTE endpoint que, na Fase 2, substitui o arquivo data/games.json.
 *
 * @CrossOrigin libera o front-end (outra porta) a consumir a API
 * durante o desenvolvimento.
 */
@RestController
@RequestMapping("/api/jogos")
@CrossOrigin(origins = "*")
public class JogoController {

    private final JogoRepository repo;

    public JogoController(JogoRepository repo) {
        this.repo = repo; // injecao de dependencia pelo construtor
    }

    // GET /api/jogos              -> todos
    // GET /api/jogos?busca=mario  -> filtra por nome
    @GetMapping
    public List<Jogo> listar(@RequestParam(required = false) String busca) {
        if (busca != null && !busca.isBlank()) {
            return repo.findByNomeContainingIgnoreCase(busca);
        }
        return repo.findAll();
    }

    // GET /api/jogos/promocoes
    @GetMapping("/promocoes")
    public List<Jogo> promocoes() {
        return repo.findByPrecoPromocionalIsNotNull();
    }

    // GET /api/jogos/genero/RPG
    @GetMapping("/genero/{nome}")
    public List<Jogo> porGenero(@PathVariable String nome) {
        return repo.findByGeneroNome(nome);
    }

    // GET /api/jogos/1
    @GetMapping("/{id}")
    public Jogo porId(@PathVariable Long id) {
        return repo.findById(id).orElseThrow();
    }
}
