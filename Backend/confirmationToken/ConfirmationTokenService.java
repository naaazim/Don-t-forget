package com.example.dontForget.confirmationToken;

import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
public class ConfirmationTokenService {
    ConfirmationTokenRepository confirmationTokenRepository;
    public void delete(ConfirmationToken token){
        confirmationTokenRepository.delete(token);
    }
}
