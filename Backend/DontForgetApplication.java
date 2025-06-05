package com.example.dontForget;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
@EnableScheduling
@SpringBootApplication
public class DontForgetApplication {

	public static void main(String[] args) {
		SpringApplication.run(DontForgetApplication.class, args);
	}

}
