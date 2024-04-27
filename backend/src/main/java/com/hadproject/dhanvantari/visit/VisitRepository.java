package com.hadproject.dhanvantari.visit;

import com.hadproject.dhanvantari.patient.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VisitRepository extends JpaRepository<Visit, Long> {
//    List<Visit> findVisitByDoctor_DoctorIdAndAndPatient_PatientId(Integer doctor_id, Integer patient_id);
    List<Visit> findVisitByPatient(Patient patient);

    Visit findVisitByReferenceNumber(String referenceNumber);
    Visit findVisitByRequestId (String requestId);

    Visit findVisitByVisitId(Long visitId);
}
