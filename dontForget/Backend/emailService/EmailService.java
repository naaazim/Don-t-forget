package com.example.dontForget.emailService;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;

import java.io.UnsupportedEncodingException;

@Service
@AllArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;


    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            helper.setFrom(new InternetAddress("contact@dontforget.site", "Don't Forget", "UTF-8"));

            System.out.println("📨 Tentative d’envoi d’un email à " + to + " avec sujet : " + subject);
            mailSender.send(mimeMessage);
            System.out.println("✅ Email envoyé avec succès à " + to);

        } catch (MessagingException | UnsupportedEncodingException e) {
            System.err.println("❌ Erreur lors de l’envoi d’email à " + to + " : " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Erreur lors de l'envoi de l'e-mail", e);
        } catch (Exception e) {
            System.err.println("❌ Erreur inattendue : " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}
