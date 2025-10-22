package com.example.RegisterLogin.appuser;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UpdateRequest {

    private String email;
    private AppUserRole role;
}
