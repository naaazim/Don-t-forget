package com.example.dontForget.tache;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.dontForget.appUser.AppUser;

public interface TacheRepository extends JpaRepository<Tache, Long>{
    List<Tache> findByUser(AppUser user);
}
