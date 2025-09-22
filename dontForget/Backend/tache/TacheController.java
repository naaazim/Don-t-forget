package com.example.dontForget.tache;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.dontForget.appUser.AppUser;
import com.example.dontForget.appUser.AppUserRepository;
import lombok.AllArgsConstructor;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@AllArgsConstructor
@RequestMapping("api/v1/tache")
public class TacheController {

    private final TacheRepository tacheRepository;
    private final AppUserRepository appUserRepository;
    private final ReminderScheduler reminderScheduler;

    private static final DateTimeFormatter formatter =
            DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    @PostMapping("/create")
    public ResponseEntity<?> createTache(@RequestBody Tache tache) {
        Optional<AppUser> userOptional = appUserRepository.findById(tache.getUser().getId());
        if (!userOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        AppUser user = userOptional.get();

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
            reminderScheduler.scheduleReminder(tache);
        }

        return ResponseEntity.status(HttpStatus.OK).body("Tâche créée avec succès");
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<?> getTacheById(@PathVariable Long id) {
        Optional<Tache> tacheOptional = tacheRepository.findById(id);
        if (!tacheOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Aucune tâche avec cet ID");
        }
        return ResponseEntity.ok(tacheOptional.get());
    }

    @GetMapping("/getAllByUser/{id}")
    public ResponseEntity<?> getAll(@PathVariable Long id) {
        Optional<AppUser> userOptional = appUserRepository.findById(id);
        if (!userOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Aucun utilisateur avec cet ID");
        }
        List<Tache> maListe = tacheRepository.findByUser(userOptional.get());
        return ResponseEntity.ok(maListe);
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
