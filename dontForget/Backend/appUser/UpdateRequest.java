package com.example.dontForget.appUser;

import lombok.AllArgsConstructor;
import lombok.Data;
@AllArgsConstructor
@Data
public class UpdateRequest {
    private String nom;
    private String prenom;
    private String email;
}
