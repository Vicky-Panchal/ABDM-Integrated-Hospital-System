package com.hadproject.dhanvantari.visit;

import com.hadproject.dhanvantari.doctor.Doctor;
import com.hadproject.dhanvantari.patient.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VisitRepository extends JpaRepository<Visit, Long> {
    List<Visit> findVisitByDoctorAndPatient(Doctor doctor, Patient patient);
    List<Visit> findVisitByPatient(Patient patient);
    List<Visit> findVisitByDoctor(Doctor doctor);

    Visit findVisitByReferenceNumber(String referenceNumber);
    Visit findVisitByRequestId (String requestId);

    Visit findVisitById(Long id);
}
