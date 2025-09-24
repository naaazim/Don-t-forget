package com.example.dontForget.oath2;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.example.dontForget.appUser.AppUser;
import com.example.dontForget.appUser.AppUserRepository;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final AppUserRepository userRepository;

    public CustomOAuth2UserService(AppUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        OAuth2User delegate = super.loadUser(userRequest);

        Map<String, Object> attrs = new HashMap<>(delegate.getAttributes());
        String email = (String) attrs.get("email");
        String givenName = (String) attrs.getOrDefault("given_name", attrs.get("name"));
        String familyName = (String) attrs.get("family_name");

        AppUser user = userRepository.findByEmail(email);
        if (user == null) {
            user = new AppUser();
            user.setEmail(email);
            if (familyName != null) user.setNom(familyName);
            if (givenName != null) user.setPrenom(givenName);
            user = userRepository.save(user);
        }

        Set<GrantedAuthority> authorities = new HashSet<>(delegate.getAuthorities());

        // 🔥 Uniformisation → toujours "id"
        attrs.put("id", user.getId());

        String nameAttrKey = userRequest.getClientRegistration()
                .getProviderDetails()
                .getUserInfoEndpoint()
                .getUserNameAttributeName();

        return new DefaultOAuth2User(authorities, attrs, nameAttrKey);
    }
}
