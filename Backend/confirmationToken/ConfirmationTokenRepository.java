package com.example.dontForget.confirmationToken;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConfirmationTokenRepository extends JpaRepository<ConfirmationToken, Long>{
    Optional<ConfirmationToken> findByToken(String Token);
    List<ConfirmationToken> findAllByExpiresAtBefore(LocalDateTime now);
}
