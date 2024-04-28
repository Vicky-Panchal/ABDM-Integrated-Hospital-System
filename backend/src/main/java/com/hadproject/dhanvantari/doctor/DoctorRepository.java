package com.hadproject.dhanvantari.doctor;

import com.hadproject.dhanvantari.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByDoctorId(Long doctorId);

    Optional<Doctor> findDoctorByUser(User user);
}
