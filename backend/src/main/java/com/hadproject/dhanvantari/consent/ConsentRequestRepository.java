package com.hadproject.dhanvantari.consent;

import com.hadproject.dhanvantari.doctor.Doctor;
import com.hadproject.dhanvantari.patient.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConsentRequestRepository extends JpaRepository<ConsentRequest, Long> {
    ConsentRequest findConsentRequestByRequestId(String requestId);
    ConsentRequest findConsentRequestByConsentRequestId(String consentRequestId);
    List<ConsentRequest> findConsentRequestByDoctor(Doctor doctor);
    List<ConsentRequest> findConsentRequestByPatient(Patient patient);
}
