package com.example.dontForget.passwordResetToken;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PasswordResetEmailRequest {
    private String email;
}
