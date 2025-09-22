package com.example.dontForget.cleanUp;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.example.dontForget.appUser.AppUserRepository;
import com.example.dontForget.confirmationToken.ConfirmationToken;
import com.example.dontForget.confirmationToken.ConfirmationTokenRepository;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
@Transactional
@Service
@AllArgsConstructor
public class CleanUpService {
    private final ConfirmationTokenRepository confirmationTokenRepository;
    private final AppUserRepository appUserRepository;
    @Scheduled(fixedRate = 16*60*1000)
    public void cleanExpiredToken(){
        List<ConfirmationToken> expiredTokens = confirmationTokenRepository.findAllByExpiresAtBefore(LocalDateTime.now());
        for(ConfirmationToken token : expiredTokens){
            if(!token.getUser().isValide()){
                confirmationTokenRepository.delete(token);
                appUserRepository.delete(token.getUser());
            }
        }
    }
}
