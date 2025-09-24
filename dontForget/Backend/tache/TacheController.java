package com.example.dontForget.tache;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import com.example.dontForget.appUser.AppUser;
import com.example.dontForget.appUser.AppUserRepository;

import lombok.AllArgsConstructor;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@AllArgsConstructor
@RequestMapping("api/v1/tache")
public class TacheController {

    private final TacheRepository tacheRepository;
    private final AppUserRepository appUserRepository;
    private final ReminderScheduler reminderScheduler;

    private static final DateTimeFormatter formatter =
            DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    @PostMapping("/create")
    public ResponseEntity<?> createTache(@RequestBody Tache tache, Authentication authentication) {
        AppUser user;

        if (authentication.getPrincipal() instanceof OAuth2User oauthUser) {
            // 🔥 On récupère l’email (qui est garanti par Google)
            String email = oauthUser.getAttribute("email");
            if (email == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Utilisateur OAuth2 invalide : email manquant");
            }

            user = appUserRepository.findByEmail(email);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Utilisateur OAuth2 non trouvé en base");
            }
        } else {
            // Cas JWT classique
            String email = authentication.getName();
            user = appUserRepository.findByEmail(email);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utilisateur non trouvé");
            }
        }

        OffsetDateTime nowUtc = OffsetDateTime.now(ZoneOffset.UTC);

        if (tache.getMustBeFinishedAt() != null && tache.getMustBeFinishedAt().isBefore(nowUtc)) {
            return ResponseEntity.badRequest()
                    .body("La date d'échéance doit être postérieure au " + nowUtc.format(formatter) + ".");
        }

        tache.setCreatedAt(nowUtc);
        tache.setUser(user);
        tache.setStatut(Statut.A_FAIRE);

        tacheRepository.save(tache);

        if (tache.getReminder() != null) {
            System.out.println("✅ Planification du rappel pour " + user.getEmail()
                    + " à " + tache.getReminder());
            reminderScheduler.scheduleReminder(tache);
        }

        return ResponseEntity.ok("Tâche créée avec succès");
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<?> getTacheById(@PathVariable Long id) {
        return tacheRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Aucune tâche avec cet ID"));
    }

    @GetMapping("/getAllByUser/{id}")
    public ResponseEntity<?> getAll(@PathVariable Long id) {
        return appUserRepository.findById(id)
                .<ResponseEntity<?>>map(user -> ResponseEntity.ok(tacheRepository.findByUser(user)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Aucun utilisateur avec cet ID"));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateTache(@PathVariable Long id, @RequestBody Tache request) {
        Optional<Tache> tacheOptional = tacheRepository.findById(id);
        if (!tacheOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Aucune tâche avec cet ID");
        }

        Tache tache = tacheOptional.get();
        OffsetDateTime nowUtc = OffsetDateTime.now(ZoneOffset.UTC);

        if (request.getMustBeFinishedAt() != null) {
            if (request.getMustBeFinishedAt().isBefore(nowUtc)) {
                return ResponseEntity.badRequest()
                        .body("La date d'échéance doit être postérieure au " + nowUtc.format(formatter) + ".");
            }
            tache.setMustBeFinishedAt(request.getMustBeFinishedAt());
        }

        if (request.getReminder() != null) {
            if (request.getReminder().isBefore(nowUtc)) {
                return ResponseEntity.badRequest()
                        .body("La date de rappel doit être postérieure au " + nowUtc.format(formatter) + ".");
            }
            tache.setReminder(request.getReminder());
        }

        if (request.getStatut() != null) {
            tache.setStatut(request.getStatut());
        }
        if (request.getTexte() != null) {
            tache.setTexte(request.getTexte());
        }

        tacheRepository.save(tache);

        if (tache.getReminder() != null) {
            System.out.println("🔄 Mise à jour du rappel pour " + tache.getUser().getEmail()
                    + " à " + tache.getReminder());
            reminderScheduler.scheduleReminder(tache);
        }

        return ResponseEntity.ok("Tâche mise à jour avec succès");
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteTache(@PathVariable Long id) {
        Optional<Tache> tacheOptional = tacheRepository.findById(id);
        if (!tacheOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Aucune tâche avec cet ID");
        }
        tacheRepository.delete(tacheOptional.get());
        return ResponseEntity.ok("Tâche supprimée avec succès");
    }
}
