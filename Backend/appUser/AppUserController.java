package com.example.dontForget.appUser;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.dontForget.confirmationToken.ConfirmationToken;
import com.example.dontForget.confirmationToken.ConfirmationTokenRepository;
import com.example.dontForget.confirmationToken.ConfirmationTokenService;
import com.example.dontForget.emailService.EmailService;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.Optional;

@AllArgsConstructor
@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/v1")
public class AppUserController {
    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final ConfirmationTokenRepository confirmationTokenRepository;
    private final EmailService emailService;
    private final ConfirmationTokenService confirmationTokenService;
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AppUser request){
        if(appUserRepository.findByEmail(request.getEmail()) != null){
            return ResponseEntity.badRequest().body("Email déja pris");
        }
        AppUser user = new AppUser(request.getNom(), request.getPrenom(), request.getEmail(), passwordEncoder.encode(request.getPassword()));
        appUserRepository.save(user);
        ConfirmationToken confirmationToken = new ConfirmationToken(user);
        confirmationTokenRepository.save(confirmationToken);
        String lienActivation = "http://localhost:3000/confirmation?token="+confirmationToken.getToken();
        emailService.sendHtmlEmail(
            user.getEmail(),
            "Activation de votre compte",
            buildActivationEmail(user.getPrenom(), lienActivation)
        );
        return ResponseEntity.ok().body("Inscription réussie vérifiez vos mails pour activer votre compte");
    }
    @GetMapping("/confirm")
    public ResponseEntity<?> confirm(@RequestParam String token){
        Optional<ConfirmationToken> optionalToken = confirmationTokenRepository.findByToken(token); 
        if(!optionalToken.isPresent()){
            return ResponseEntity.badRequest().body("Token invalide");
        }
        ConfirmationToken confirmationToken = optionalToken.get();
        if(confirmationToken.getExpiresAt().isBefore(LocalDateTime.now())){
            return ResponseEntity.status(HttpStatus.GONE).body("Le lien a expiré veuillez vous réinscrire");
        }
        AppUser user = confirmationToken.getUser();
        user.setValide(true);
        appUserRepository.save(user);
        confirmationTokenService.delete(confirmationToken); 
        return ResponseEntity.ok().body("Compte activé avec succès !");
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UpdateRequest request){
        Optional<AppUser> userOptionel = appUserRepository.findById(id);
        if(!userOptionel.isPresent()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Aucun utilisateur avec cet ID");
        }
        AppUser user = userOptionel.get();
        if (request.getNom() != null && !request.getNom().isEmpty()) {
            user.setNom(request.getNom());
        }
        if (request.getPrenom() != null && !request.getPrenom().isEmpty()) {
            user.setPrenom(request.getPrenom());
        }
        appUserRepository.save(user);
        return ResponseEntity.status(HttpStatus.OK).body("Modification effectuée avec succés");
    }
    private String buildActivationEmail(String name, String activationLink) {
        return "<div style='font-family: Arial, sans-serif; background-color: #ffffff; padding: 30px; max-width: 600px; margin: auto; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #e0e0e0;'>" +
                "<h2 style='color: #2c3e50; text-align: center;'>🎉 Bienvenue sur Don't Forget !</h2>" +
                "<p style='font-size: 16px; color: #333;'>Bonjour <strong>" + name + "</strong>,</p>" +
                "<p style='font-size: 16px; color: #333;'>Merci de vous être inscrit sur notre plateforme. Il ne vous reste plus qu’une étape pour commencer à utiliser votre compte.</p>" +
                "<p style='font-size: 16px; color: #333;'>Veuillez cliquer sur le bouton ci-dessous pour activer votre compte :</p>" +
                "<div style='text-align: center; margin: 30px 0;'>" +
                    "<a href='" + activationLink + "' style='background-color: #4a90e2; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;'>Activer mon compte</a>" +
                "</div>" +
                "<p style='font-size: 14px; color: #777;'>⏳ Ce lien expirera dans 15 minutes.</p>" +
                "<p style='font-size: 14px; color: #777;'>Si vous n'avez pas demandé cette inscription, vous pouvez ignorer cet email.</p>" +
                "<hr style='border: none; border-top: 1px solid #eee; margin: 30px 0;' />" +
                "<p style='font-size: 14px; color: #aaa; text-align: center;'>L’équipe Don't Forget vous remercie 🙌</p>" +
            "</div>";
    }


}
