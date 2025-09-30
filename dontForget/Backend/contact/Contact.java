package com.example.dontForget.contact;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Contact {
    private String name;
    private String email;
    private String message;
}
