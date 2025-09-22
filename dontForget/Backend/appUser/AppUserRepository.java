package com.example.dontForget.appUser;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AppUserRepository extends JpaRepository<AppUser, Long>{
    AppUser findByEmail(String email);
}
