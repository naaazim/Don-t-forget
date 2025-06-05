package com.example.dontForget.tache;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
    @PostMapping("/create")
    public ResponseEntity<?> createTache(@RequestBody Tache tache){
        Optional<AppUser> userOptional = appUserRepository.findById(tache.getUser().getId());
        if(!userOptional.isPresent()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        AppUser user = userOptional.get();
        if(tache.getMustBeFinishedAt()!= null && tache.getMustBeFinishedAt().isBefore(LocalDateTime.now())){
            return ResponseEntity.badRequest().body("La date d'échéance doit être posterieur au " + LocalDateTime.now().format(formatter) + ".");
        }
        tache.setCreatedAt(LocalDateTime.now());
        tache.setUser(user);
        tache.setStatut(Statut.A_FAIRE);
        tacheRepository.save(tache);
        return ResponseEntity.status(HttpStatus.OK).body("Tâche crée avec succés");
    }
    @GetMapping("/getById/{id}")
    public ResponseEntity<?> getTacheById(@PathVariable Long id){
        Optional<Tache> tacheOptional = tacheRepository.findById(id);
        if(!tacheOptional.isPresent()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Aucune tâche avec cet ID");
        }
        Tache tache = tacheOptional.get();
        return ResponseEntity.status(HttpStatus.OK).body(tache);
    }
    @GetMapping("/getAllByUser/{id}")
    public ResponseEntity<?> getAll(@PathVariable Long id){
        Optional<AppUser> userOptional = appUserRepository.findById(id);
        if(!userOptional.isPresent()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Aucun utilisateur avec cet ID");
        }
        AppUser user = userOptional.get();
        List<Tache> maListe = tacheRepository.findByUser(user);
        return ResponseEntity.status(HttpStatus.OK).body(maListe);
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateTache(@PathVariable Long id, @RequestBody Tache request){
        Optional<Tache> tacheOptional = tacheRepository.findById(id);
        if(!tacheOptional.isPresent()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Aucune tâche avec cet ID");
        }
        Tache tache = tacheOptional.get();
        if(request.getMustBeFinishedAt() != null){
            tache.setMustBeFinishedAt(request.getMustBeFinishedAt());
        }
        if(request.getReminder() != null){
            if(request.getReminder().isBefore(LocalDateTime.now())){
                return ResponseEntity.badRequest().body("La date de rappel doit être posterieur au " + LocalDateTime.now().format(formatter) + ".");
            }
            tache.setReminder(request.getReminder());
        }
        if(request.getStatut() != null){
            tache.setStatut(request.getStatut());
        }
        if(request.getTexte() != null){
            tache.setTexte(request.getTexte());
        }
        tacheRepository.save(tache);
        reminderScheduler.scheduleReminder(tache);
        return ResponseEntity.status(HttpStatus.OK).body("Tâche mise à jour avec succés");
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteTache(@PathVariable Long id){
        Optional<Tache> tacheOptional = tacheRepository.findById(id);
        if(!tacheOptional.isPresent()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Aucune tâche avec cet ID");
        }
        Tache tache = tacheOptional.get();
        tacheRepository.delete(tache);
        return ResponseEntity.status(HttpStatus.OK).body("Tâche supprimée avec succés");
    }

}
