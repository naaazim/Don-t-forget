package com.example.dontForget.contact;

import com.example.dontForget.emailService.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ContactController {

    private final EmailService emailService;

    @PostMapping("/contact")
    public ResponseEntity<?> contact(@RequestBody Contact formulaire) {
        if (formulaire.getEmail() == null || formulaire.getEmail().isBlank()) {
            return ResponseEntity.badRequest().body("L'email doit être renseigné");
        } else if (formulaire.getMessage() == null || formulaire.getMessage().isBlank()) {
            return ResponseEntity.badRequest().body("Le message doit être renseigné");
        }

        emailService.sendHtmlEmail(
                "abderhamia@gmail.com",
                "Une personne souhaite vous contacter",
                buildContactEmail(formulaire)
        );
        return ResponseEntity.ok("Email envoyé avec succès ✅");
    }

    private String buildContactEmail(Contact contact) {
        return "<div style='font-family: Arial, sans-serif; background-color: #fdfdfd; border: 1px solid #ddd; border-radius: 12px; padding: 20px; max-width: 600px; margin: auto; box-shadow: 0 4px 12px rgba(0,0,0,0.1);'>" +

                "<h2 style='color: #2c3e50; text-align: center;'>📩 Nouveau message de contact</h2>" +

                "<p style='font-size: 16px; color: #333;'>Vous avez reçu un nouveau message depuis le formulaire de contact de <b>Don't Forget</b> :</p>" +

                "<div style='margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-left: 5px solid #007bff; border-radius: 8px;'>" +
                "<p style='margin: 5px 0;'><b>👤 Nom :</b> " + contact.getName() + "</p>" +
                "<p style='margin: 5px 0;'><b>📧 Email :</b> " + contact.getEmail() + "</p>" +
                "<p style='margin: 10px 0; font-size: 15px; color: #444;'><b>💬 Message :</b></p>" +
                "<blockquote style='margin: 0; padding: 10px; background: #fff; border: 1px solid #ddd; border-radius: 8px; font-style: italic; color: #555;'>" +
                contact.getMessage() +
                "</blockquote>" +
                "</div>" +

                "<p style='font-size: 14px; color: #888; text-align: center; margin-top: 20px;'>Cet email est généré automatiquement par l'application Don't Forget.</p>" +
                "</div>";
    }
}
