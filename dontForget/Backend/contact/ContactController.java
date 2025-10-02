package com.example.dontForget.contact;

import com.example.dontForget.emailService.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.apache.commons.text.StringEscapeUtils;


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

        // Envoi de l'email vers moi même
        emailService.sendHtmlEmail(
                "abderhamia@gmail.com",
                "Une personne souhaite vous contacter",
                buildContactEmail(formulaire)
        );

        // Envoi de l'accusé de réception vers l'expéditeur
        emailService.sendHtmlEmail(
                formulaire.getEmail(),
                "Accusé de réception - Don't Forget",
                buildConfirmationEmail(formulaire)
        );

        return ResponseEntity.ok("Email envoyé avec succès ✅");
    }
    //html special chars (éviter les failles xss)
    private String escape(String input) {
        return StringEscapeUtils.escapeHtml4(input);
    }

    private String buildContactEmail(Contact contact) {
        return "<div style='font-family: Arial, sans-serif; background-color: #fdfdfd; border: 1px solid #ddd; border-radius: 12px; padding: 20px; max-width: 600px; margin: auto; box-shadow: 0 4px 12px rgba(0,0,0,0.1);'>" +

                "<h2 style='color: #2c3e50; text-align: center;'>📩 Nouveau message</h2>" +

                "<p style='font-size: 16px; color: #333;'>Vous avez reçu un nouveau message depuis le formulaire de contact de <b>Don't Forget</b> :</p>" +

                "<div style='margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-left: 5px solid #007bff; border-radius: 8px;'>" +
                "<p style='margin: 5px 0;'><b>👤 Nom :</b> " + escape(contact.getName()) + "</p>" +
                "<p style='margin: 5px 0;'><b>📧 Email :</b> " + escape(contact.getEmail()) + "</p>" +
                "<p style='margin: 10px 0; font-size: 15px; color: #444;'><b>💬 Message :</b></p>" +
                "<blockquote style='margin: 0; padding: 10px; background: #fff; border: 1px solid #ddd; border-radius: 8px; font-style: italic; color: #555;'>" +
                escape(contact.getMessage()) +
                "</blockquote>" +
                "</div>" +

                "<p style='font-size: 14px; color: #888; text-align: center; margin-top: 20px;'>Cet email est généré automatiquement par l'application Don't Forget.</p>" +
                "</div>";
    }
    private String buildConfirmationEmail(Contact contact) {
        return "<div style='font-family: Arial, sans-serif; background-color: #f4f8ff; border: 1px solid #d0e2ff; " +
                "border-radius: 12px; padding: 25px; max-width: 650px; margin: auto; " +
                "box-shadow: 0 6px 15px rgba(0,0,0,0.1); color: #333;'>" +

                "<div style='text-align: center; margin-bottom: 25px;'>" +
                "<h1 style='color: #007bff; margin: 0;'>Don<span style='color: #000'>'</span>t Forget</h1>" +
                "<hr style='border: none; border-top: 2px solid #007bff; width: 60px; margin: 15px auto;'>" +
                "</div>" +

                "<h2 style='color: #007bff; text-align: center; margin-bottom: 20px;'>📨 Message bien reçu !</h2>" +

                "<p style='font-size: 16px; color: #333; line-height: 1.5;'>Bonjour <b>" +
                (contact.getName() != null ? contact.getName() : "cher utilisateur") + "</b>,</p>" +

                "<p style='font-size: 15px; color: #333; line-height: 1.6;'>Nous vous confirmons que votre message a bien été transmis à notre équipe via le formulaire de contact de <b>Don't Forget</b>. Voici un rappel du contenu envoyé :</p>" +

                "<div style='margin: 20px 0; padding: 18px; background-color: #ffffff; border-left: 5px solid #007bff; border-radius: 10px;'>" +
                "<p style='margin: 0; font-size: 15px; color: #444;'><b>💬 Votre message :</b></p>" +
                "<blockquote style='margin: 10px 0 0 0; padding: 12px; background: #f9fbff; border: 1px solid #d6e4ff; border-radius: 8px; font-style: italic; color: #555;'>" +
                contact.getMessage() +
                "</blockquote>" +
                "</div>" +

                "<p style='font-size: 14px; color: #666; text-align: center; margin-top: 25px;'>⏳ Nous reviendrons vers vous prochainement si nécessaire.</p>" +

                "<p style='font-size: 13px; color: #888; text-align: center; margin-top: 15px;'>⚠️ Ceci est un message automatique. Merci de ne pas répondre à cet email.</p>" +

                "</div>";
    }



}
