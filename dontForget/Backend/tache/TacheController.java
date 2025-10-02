package com.example.dontForget.tache;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
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

    @PostMapping("/create")
    public ResponseEntity<?> createTache(@RequestBody Tache tache, Authentication authentication) {
        AppUser user = getUserFromAuth(authentication);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utilisateur non trouvé");
        }

        OffsetDateTime nowUtc = OffsetDateTime.now(ZoneOffset.UTC);

        if (tache.getMustBeFinishedAt() != null && tache.getMustBeFinishedAt().isBefore(nowUtc)) {
            return ResponseEntity.badRequest()
                .body("La date d'échéance doit être postérieure à maintenant.");
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
    public ResponseEntity<?> getTacheById(@PathVariable Long id, Authentication authentication) {
        Optional<Tache> tacheOptional = tacheRepository.findById(id);
        if (!tacheOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Aucune tâche avec cet ID");
        }
        Tache tache = tacheOptional.get();

        AppUser user = getUserFromAuth(authentication);
        if (user == null || !tache.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Accès interdit à cette tâche");
        }

        return ResponseEntity.ok(tache);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyTaches(Authentication authentication) {
        AppUser user = getUserFromAuth(authentication);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utilisateur non trouvé");
        }
        return ResponseEntity.ok(tacheRepository.findByUser(user));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateTache(@PathVariable Long id, @RequestBody Tache request, Authentication authentication) {
        Optional<Tache> tacheOptional = tacheRepository.findById(id);
        if (!tacheOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Aucune tâche avec cet ID");
        }

        Tache tache = tacheOptional.get();

        AppUser user = getUserFromAuth(authentication);
        if (user == null || !tache.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Accès interdit à cette tâche");
        }

        OffsetDateTime nowUtc = OffsetDateTime.now(ZoneOffset.UTC);

        if (request.getMustBeFinishedAt() != null) {
            if (request.getMustBeFinishedAt().isBefore(nowUtc)) {
                return ResponseEntity.badRequest()
                        .body("La date d'échéance doit être postérieure à maintenant.");
            }
            tache.setMustBeFinishedAt(request.getMustBeFinishedAt());
        }

        if (request.getReminder() != null) {
            if (request.getReminder().isBefore(nowUtc)) {
                return ResponseEntity.badRequest()
                        .body("La date de rappel doit être postérieure à maitenant.");
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
    public ResponseEntity<?> deleteTache(@PathVariable Long id, Authentication authentication) {
        Optional<Tache> tacheOptional = tacheRepository.findById(id);
        if (!tacheOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Aucune tâche avec cet ID");
        }

        Tache tache = tacheOptional.get();

        AppUser user = getUserFromAuth(authentication);
        if (user == null || !tache.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Accès interdit à cette tâche");
        }

        tacheRepository.delete(tache);
        return ResponseEntity.ok("Tâche supprimée avec succès");
    }

    private AppUser getUserFromAuth(Authentication authentication) {
        if (authentication == null) return null;

        if (authentication.getPrincipal() instanceof OAuth2User oauthUser) {
            String email = oauthUser.getAttribute("email");
            if (email == null) return null;
            return appUserRepository.findByEmail(email);
        } else {
            String email = authentication.getName();
            return appUserRepository.findByEmail(email);
        }
    }
}
