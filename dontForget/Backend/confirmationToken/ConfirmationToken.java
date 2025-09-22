package com.example.dontForget.confirmationToken;

import java.time.LocalDateTime;
import java.util.UUID;

import com.example.dontForget.appUser.AppUser;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
@Entity
@Table(name = "confirmation_token")
public class ConfirmationToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;

    @OneToOne
    @JoinColumn(nullable = false, name = "user_id")
    private AppUser user;

    public ConfirmationToken(AppUser user){
        this.user = user;
        token = UUID.randomUUID().toString();
        createdAt = LocalDateTime.now();
        expiresAt = createdAt.plusMinutes(15);
    }

}
