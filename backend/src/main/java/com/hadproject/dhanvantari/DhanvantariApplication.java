package com.hadproject.dhanvantari;

import com.hadproject.dhanvantari.auth.AuthenticationService;
import com.hadproject.dhanvantari.user.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
public class DhanvantariApplication {

	public static void main(String[] args) {
		SpringApplication.run(DhanvantariApplication.class, args);
	}

	@Bean
	public CommandLineRunner commandLineRunner(
			UserRepository userRepository,
			AuthenticationService authService
	) {

		return args -> {
		};
	}
}
