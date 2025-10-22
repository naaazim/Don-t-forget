package com.example.RegisterLogin.authentication;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.RegisterLogin.appuser.AppUser;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;

    //inscrit un utilisateur et renvoie un token d'activation 
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegistrationRequest request){
        return ResponseEntity.ok(service.register(request));
    }

    //retourne un jwt et l'utilisateur connecté
    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody LoginRequest request){
        return ResponseEntity.ok(service.login(request));
    }

    //envoie un email avec le mot de passe géneré aleatoirement
    @PostMapping("/mdp-oublie/{email}")
    public ResponseEntity<String>MotDePasseOublie (@PathVariable String email){
        return ResponseEntity.ok(service.MotDePasseOublie(email));
    }

    //confirme le token de l'activation de compte
    @GetMapping("/confirm")
    public ResponseEntity<Void> confirm(@RequestParam("token") String token) {
        try {
            service.confirmToken(token);
            return ResponseEntity.ok().body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
    }

    //ajoute un user sans avoir à activer son compte
    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/admin-add")
    public AppUser adminAjouteUser (@RequestBody RegistrationRequest request){
        return service.adminAjouteUser(request);
    }

    

}
