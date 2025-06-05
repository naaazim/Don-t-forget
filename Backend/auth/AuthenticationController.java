package com.example.dontForget.auth;

import com.example.dontForget.appUser.AppUser;
import com.example.dontForget.appUser.AppUserRepository;
import com.example.dontForget.jwt.JwtService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;

import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthenticationController {

    private final AppUserRepository appUserRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (AuthenticationException e) {
            // Ici on renvoie un status 401 Unauthorized avec un message clair
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

        // On renvoie un objet avec token + infos utilisateur, statut 200 OK
        AuthenticationResponse response = new AuthenticationResponse(token,user.getId(), user.getNom(), user.getPrenom(), user.getEmail());
        return ResponseEntity.ok(response);
    }
}
