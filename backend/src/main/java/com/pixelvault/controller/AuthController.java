package com.pixelvault.controller;

import com.pixelvault.dto.LoginRequest;
import com.pixelvault.dto.RegistroRequest;
import com.pixelvault.model.Usuario;
import com.pixelvault.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
public class AuthController {

    private final UsuarioRepository usuarioRepository;

    public AuthController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    // POST /api/auth/login
    @PostMapping("/api/auth/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest request) {
        Optional<Usuario> resultado = usuarioRepository.findByEmail(request.getEmail());

        Map<String, Object> resposta = new HashMap<>();

        if (resultado.isEmpty()) {
            resposta.put("erro", "E-mail ou senha incorretos.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(resposta);
        }

        Usuario usuario = resultado.get();

        if (!usuario.getSenha().equals(request.getSenha())) {
            resposta.put("erro", "E-mail ou senha incorretos.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(resposta);
        }

        resposta.put("nome", usuario.getNome());
        resposta.put("email", usuario.getEmail());
        return ResponseEntity.ok(resposta);
    }

    // POST /api/usuarios
    @PostMapping("/api/usuarios")
    public ResponseEntity<Map<String, Object>> registrar(@RequestBody RegistroRequest request) {
        Map<String, Object> resposta = new HashMap<>();

        if (usuarioRepository.existsByEmail(request.getEmail())) {
            resposta.put("erro", "Ja existe uma conta com este e-mail.");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(resposta);
        }

        if (usuarioRepository.existsByCpf(request.getCpf())) {
            resposta.put("erro", "Ja existe uma conta com este CPF.");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(resposta);
        }

        Usuario novoUsuario = new Usuario();
        novoUsuario.setNome(request.getNome());
        novoUsuario.setEmail(request.getEmail());
        novoUsuario.setCpf(request.getCpf().replaceAll("[^0-9]", ""));
        novoUsuario.setTelefone(request.getTelefone());
        novoUsuario.setSenha(request.getSenha());
        novoUsuario.setCriadoEm(LocalDateTime.now());

        try {
            usuarioRepository.save(novoUsuario);
        } catch (Exception e) {
            resposta.put("erro", "Erro ao salvar usuario: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(resposta);
        }

        resposta.put("ok", true);
        return ResponseEntity.status(HttpStatus.CREATED).body(resposta);
    }
}
