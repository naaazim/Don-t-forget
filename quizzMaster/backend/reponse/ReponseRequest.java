package com.example.RegisterLogin.reponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class ReponseRequest {
    private String texte;
    private Boolean valeur;
    private long questionId;

}
