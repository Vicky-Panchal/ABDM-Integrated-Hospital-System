package com.hadproject.dhanvantari.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OtpRepository extends JpaRepository<Otp, Long> {
    Otp findOtpByUserEmail(String email);

    Optional<Otp> findByUser(User user);

}
