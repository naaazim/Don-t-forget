package com.example.dontForget.passwordResetToken;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.dontForget.appUser.AppUser;
import com.example.dontForget.emailService.EmailService;

import lombok.AllArgsConstructor;
@AllArgsConstructor
@Service
@Transactional
public class PasswordResetTokenService {

    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;
    
    public Optional<PasswordResetToken> getToken(String token) {
        return tokenRepository.findByToken(token);
    }

    public boolean isTokenValid(PasswordResetToken token) {
        return token.getExpiresAt().isAfter(LocalDateTime.now());
    }
    public PasswordResetToken createTokenForUser(AppUser user) {
        PasswordResetToken token = new PasswordResetToken();
        token.setUser(user);
        token.setExpiresAt(LocalDateTime.now().plusMinutes(15));
        tokenRepository.save(token);
        return token;
    }
    public void deleteToken(PasswordResetToken token) {
        tokenRepository.delete(token);
    }
    public void sendPasswordResetEmail(AppUser user, PasswordResetToken token) {
    String resetLink = "http://localhost:3000/reset-password?token=" + token.getToken();

    String subject = "Réinitialisation de votre mot de passe";

    String message = "<html>"
            + "<body style=\"font-family:Arial, sans-serif;\">"
            + "<h2>Bonjour " + user.getPrenom() + ",</h2>"
            + "<p>Vous avez demandé à réinitialiser votre mot de passe.</p>"
            + "<p>Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :</p>"
            + "<a href=\"" + resetLink + "\" style=\""
            + "display:inline-block;"
            + "padding:10px 20px;"
            + "font-size:16px;"
            + "color:#ffffff;"
            + "background-color:#007bff;"
            + "text-decoration:none;"
            + "border-radius:5px;\">"
            + "Réinitialiser mon mot de passe"
            + "</a>"
            + "<p>Ce lien est valide pendant 15 minutes.</p>"
            + "<p>Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>"
            + "<br>"
            + "<p>Cordialement,<br>L'équipe Don't forget.</p>"
            + "</body>"
            + "</html>";

    emailService.sendHtmlEmail(user.getEmail(), subject, message);
}

}

