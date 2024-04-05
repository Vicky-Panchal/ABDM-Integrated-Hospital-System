package com.hadproject.dhanvantari.patient;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientRepository extends JpaRepository<Patient, Long> {

    Patient findPatientByPatientId(long id);

    Patient findPatientByUser_HealthId(String abhaId);
}
