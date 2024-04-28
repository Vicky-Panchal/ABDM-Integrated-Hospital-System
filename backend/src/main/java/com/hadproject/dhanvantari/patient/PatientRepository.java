package com.hadproject.dhanvantari.patient;

import com.hadproject.dhanvantari.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface PatientRepository extends JpaRepository<Patient, Long> {

    Optional<Patient> findPatientByUser(User user);
    Patient findPatientByPatientId(Long id);

    Patient findPatientByUser_HealthId(String abhaId);

}

