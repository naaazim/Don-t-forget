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
        String resetLink = "https://www.dontforget.site/reset-password?token=" + token.getToken();
        String subject = "🔐 Réinitialisation de votre mot de passe";

        String message = "<div style='font-family: Arial, sans-serif; background-color: #ffffff; padding: 30px; max-width: 600px; margin: auto; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #e0e0e0;'>" +
                "<h2 style='color: #4a90e2; text-align: center;'>🛠️ Réinitialisation de mot de passe</h2>" +
                "<p style='font-size: 16px; color: #333;'>Bonjour <strong>" + user.getPrenom() + "</strong>,</p>" +
                "<p style='font-size: 16px; color: #333;'>Nous avons reçu une demande de réinitialisation de votre mot de passe.</p>" +
                "<p style='font-size: 16px; color: #333;'>Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :</p>" +
                "<div style='text-align: center; margin: 30px 0;'>" +
                    "<a href='" + resetLink + "' style='background-color: #4a90e2; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;'>Réinitialiser mon mot de passe</a>" +
                "</div>" +
                "<p style='font-size: 14px; color: #777;'>⏳ Ce lien est valide pendant 15 minutes.</p>" +
                "<p style='font-size: 14px; color: #777;'>Si vous n'avez pas fait cette demande, ignorez simplement ce message. Aucun changement ne sera appliqué.</p>" +
                "<hr style='border: none; border-top: 1px solid #eee; margin: 30px 0;' />" +
                "<p style='font-size: 14px; color: #aaa; text-align: center;'>Merci d’utiliser Don't Forget 🙏</p>" +
            "</div>";

        emailService.sendHtmlEmail(user.getEmail(), subject, message);
    }

}
