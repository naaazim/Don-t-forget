package com.example.dontForget.passwordResetToken;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordVerificationRequest {
    private Long id;
    private String currentPassword;
}
