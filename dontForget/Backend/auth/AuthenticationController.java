package com.example.dontForget.auth;

import com.example.dontForget.appUser.AppUser;
import com.example.dontForget.appUser.AppUserRepository;
import com.example.dontForget.jwt.JwtService;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;

import org.springframework.web.bind.annotation.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthenticationController {

    private final AppUserRepository appUserRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletResponse resp) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (AuthenticationException e) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body("Email ou mot de passe incorrect");
        }

        AppUser user = appUserRepository.findByEmail(request.getEmail());
        if (user == null) {
            return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body("Utilisateur non trouvé");
        }

        String token = jwtService.generateToken(user);

        // --- Cookies (dev local HTTP => secure(false)) ---
        ResponseCookie jwtCookie = ResponseCookie.from("jwt_token", token)
                .httpOnly(true)
                .secure(true)        // en local HTTP
                .sameSite("none")
                .path("/")
                .maxAge(7 * 24 * 60 * 60) // 7 jours
                .build();

        // Un cookie "user" lisible côté client pour éviter localStorage
        try {
            String userJson = objectMapper.writeValueAsString(
                Map.of(
                    "id", user.getId(),
                    "nom", user.getNom(),
                    "prenom", user.getPrenom(),
                    "email", user.getEmail()
                )
            );
            String encoded = URLEncoder.encode(userJson, StandardCharsets.UTF_8);
            ResponseCookie userCookie = ResponseCookie.from("user", encoded)
                    .httpOnly(false)
                    .secure(true) 
                    .sameSite("none")
                    .path("/")
                    .maxAge(7 * 24 * 60 * 60)
                    .build();

            resp.addHeader("Set-Cookie", jwtCookie.toString());
            resp.addHeader("Set-Cookie", userCookie.toString());
        } catch (Exception ignored) {
            resp.addHeader("Set-Cookie", jwtCookie.toString());
        }

        // tu peux renvoyer la même réponse qu'avant si tu veux
        AuthenticationResponse response =
            new AuthenticationResponse(token, user.getId(), user.getNom(), user.getPrenom(), user.getEmail());
        return ResponseEntity.ok(response);
    }

    // (optionnel) un logout très simple pour effacer les cookies
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse resp) {
        ResponseCookie deleteJwt = ResponseCookie.from("jwt_token", "")
                .httpOnly(true).secure(true).sameSite("Lax").path("/").maxAge(0).build();
        ResponseCookie deleteUser = ResponseCookie.from("user", "")
                .httpOnly(false).secure(false).sameSite("none").path("/").maxAge(0).build();
        resp.addHeader("Set-Cookie", deleteJwt.toString());
        resp.addHeader("Set-Cookie", deleteUser.toString());
        return ResponseEntity.ok(Map.of("message", "Logged out"));
    }
}
