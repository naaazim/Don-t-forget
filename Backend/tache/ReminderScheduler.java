package com.example.dontForget.tache;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.*;

import org.springframework.stereotype.Component;

import com.example.dontForget.emailService.EmailService;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ReminderScheduler {

    private final EmailService emailService;
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
    private final Map<Long, ScheduledFuture<?>> scheduledTasks = new ConcurrentHashMap<>();

    public void scheduleReminder(Tache tache) {
        Long tacheId = tache.getId();

        // Annuler l’ancien rappel s’il existe
        if (scheduledTasks.containsKey(tacheId)) {
            scheduledTasks.get(tacheId).cancel(false);
        }

        // Calcul du délai
        LocalDateTime now = LocalDateTime.now();
        Duration delay = Duration.between(now, tache.getReminder());

        if (delay.isNegative() || delay.isZero()) return; // On n’envoie rien dans le passé

        ScheduledFuture<?> future = scheduler.schedule(() -> {
            emailService.sendHtmlEmail(
                tache.getUser().getEmail(),
                "Rappel de votre tâche",
                buildReminderEmail(tache.getTexte())
            );
            scheduledTasks.remove(tacheId); // Nettoyage
        }, delay.toMillis(), TimeUnit.MILLISECONDS);

        scheduledTasks.put(tacheId, future);
    }

    private String buildReminderEmail(String texte) {
        return "<div style='font-family: Arial, sans-serif; background-color: #f8f9fa; border: 1px solid #ddd; border-radius: 10px; padding: 20px; max-width: 450px; margin: auto; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-top:20px'>" +
              "<div style='font-size: 50px; color: #ff4d4f;'>⏰</div>" +
              "<h2 style='color: #333;'>Rappel de tâche</h2>" +
              "<p style='font-size: 16px; color: #555;'>Ce message est un rappel automatique généré par votre application Don't Forget. Il vous aide à rester organisé et à ne rien laisser de côté.</p>" +
              "<p style='font-size: 16px; color: #555; margin-top: 10px;'>La tâche suivante est prévue :</p>" +
              "<p style='font-size: 18px; font-weight: bold; color: #007bff;'>\"" + texte + "\"</p>" +
              "<p style='font-size: 14px; color: #888; margin-top: 20px;'>N'oubliez pas de la réaliser dans les temps pour rester organisé et efficace 💪</p>" +
              "</div>";
    }
}
