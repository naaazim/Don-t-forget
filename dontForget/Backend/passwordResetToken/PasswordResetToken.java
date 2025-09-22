package com.example.dontForget.passwordResetToken;

import com.example.dontForget.appUser.AppUser;
import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.JoinColumn;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import lombok.Data;
@Data
@Entity
public class PasswordResetToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String token;
    private LocalDateTime expiresAt;
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;
    public PasswordResetToken(){
        token = UUID.randomUUID().toString();
        expiresAt = LocalDateTime.now().plusMinutes(15);
    }
}
