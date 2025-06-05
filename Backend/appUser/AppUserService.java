package com.example.dontForget.appUser;
import java.util.Collections;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
@AllArgsConstructor
@Service
public class AppUserService implements UserDetailsService{
    final AppUserRepository appUserRepository;
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException{
        AppUser user = appUserRepository.findByEmail(email);
        if(user == null){
            throw new UsernameNotFoundException("Email invalide");
        }
        return new User(user.getEmail(), user.getPassword(), Collections.singletonList(new SimpleGrantedAuthority("user")));
    }
}
