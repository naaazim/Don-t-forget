package com.example.dontForget.tache;

import java.time.OffsetDateTime;
import com.example.dontForget.appUser.AppUser;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
public class Tache {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String texte;

    // Toujours en UTC
    private OffsetDateTime createdAt;
    private OffsetDateTime mustBeFinishedAt;

    @Column(name = "reminder")
    private OffsetDateTime reminder;

    @Enumerated(EnumType.STRING)
    private Statut statut;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private AppUser user;
}
