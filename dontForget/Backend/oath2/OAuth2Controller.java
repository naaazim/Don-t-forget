package com.example.dontForget.oath2;
import com.example.dontForget.appUser.AppUser;
import com.example.dontForget.appUser.AppUserRepository;
import com.example.dontForget.jwt.JwtService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/oauth2")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class OAuth2Controller {

    private final AppUserRepository appUserRepository;
    private final JwtService jwtService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping("/success")
    public void success(Authentication authentication, HttpServletResponse resp) throws IOException {
        if (authentication instanceof OAuth2AuthenticationToken oauth2Token) {
            Map<String, Object> attributes = oauth2Token.getPrincipal().getAttributes();

            String email = (String) attributes.get("email");
            String firstName = (String) attributes.get("given_name");
            String lastName = (String) attributes.get("family_name");

            AppUser user = appUserRepository.findByEmail(email);
            if (user == null) {
                user = new AppUser();
                user.setEmail(email);
                user.setNom(lastName != null ? lastName : "");
                user.setPrenom(firstName != null ? firstName : "");
                user.setValide(true); 
                user.setPassword(null); 
                appUserRepository.save(user);
            }

            String token = jwtService.generateToken(user);
            addAuthCookies(resp, user, token);

            // Redirection vers le frontend (dashboard)
            resp.sendRedirect("http://dontforget.site/dashboard");
        } else {
            resp.sendRedirect("http://dontforget.site/Login?error=oauth2");
        }
    }
    @GetMapping("/failure")
    public ResponseEntity<?> failure() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("OAuth2 login failed");
    }

    // --- Méthode utilitaire ---
    private void addAuthCookies(HttpServletResponse resp, AppUser user, String token) {
        ResponseCookie jwtCookie = ResponseCookie.from("jwt_token", token)
                .httpOnly(true)
                .secure(true) // HTTPS obligatoire en prod
                .sameSite("none")
                .path("/")
                .maxAge(7 * 24 * 60 * 60)
                .build();

        try {
            String userJson = objectMapper.writeValueAsString(
                Map.of(
                    "id", user.getId(),
                    "nom", user.getNom(),
                    "prenom", user.getPrenom(),
                    "email", user.getEmail()
                )
            );
            String encoded = URLEncoder.encode(userJson, StandardCharsets.UTF_8);
            ResponseCookie userCookie = ResponseCookie.from("user", encoded)
                    .httpOnly(false)
                    .secure(true)
                    .sameSite("none")
                    .path("/")
                    .maxAge(7 * 24 * 60 * 60)
                    .build();

            resp.addHeader("Set-Cookie", jwtCookie.toString());
            resp.addHeader("Set-Cookie", userCookie.toString());
        } catch (Exception ignored) {
            resp.addHeader("Set-Cookie", jwtCookie.toString());
        }
    }
}
