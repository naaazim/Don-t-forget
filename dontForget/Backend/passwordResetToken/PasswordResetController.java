package com.example.dontForget.passwordResetToken;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.dontForget.appUser.AppUser;
import com.example.dontForget.appUser.AppUserRepository;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@Controller
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/v1")
public class PasswordResetController {

    private final AppUserRepository appUserRepository;
    private final PasswordResetTokenService passwordResetTokenService;
    private final PasswordEncoder passwordEncoder;
    @PostMapping("/mot-de-passe-oublie")
    public ResponseEntity<?> motDePasseOublie(@RequestBody PasswordResetEmailRequest request){
        AppUser user = appUserRepository.findByEmail(request.getEmail());

        if(user == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Aucun utilisateur trouvé avec cet email");
        }

        PasswordResetToken token = passwordResetTokenService.createTokenForUser(user);

        passwordResetTokenService.sendPasswordResetEmail(user, token);

        return ResponseEntity.ok("Un email a été envoyé pour réinitialiser votre mot de passe.");
    }
    @PutMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam("token") String tokenParam, @RequestBody PasswordResetRequest request) {

        Optional<PasswordResetToken> tokenOptional = passwordResetTokenService.getToken(tokenParam);

        if (!tokenOptional.isPresent()) {
            return ResponseEntity.badRequest().body("Token invalide");
        }

        PasswordResetToken token = tokenOptional.get();

        if (!passwordResetTokenService.isTokenValid(token)) {
            return ResponseEntity.badRequest().body("Le lien a expiré, veuillez recommencer");
        }

        AppUser user = token.getUser();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        appUserRepository.save(user);
        passwordResetTokenService.deleteToken(token);

        return ResponseEntity.ok("Mot de passe mis à jour avec succès");
    }
    @PostMapping("/verify-password")
    public ResponseEntity<?> verifyPasswordAndGenerateToken(@RequestBody PasswordVerificationRequest request) {
        AppUser user = appUserRepository.findById(request.getId()).orElse(null);

        if (user == null || !passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Mot de passe incorrect");
        }

        PasswordResetToken token = passwordResetTokenService.createTokenForUser(user);
        return ResponseEntity.ok(token.getToken());
    }

}
