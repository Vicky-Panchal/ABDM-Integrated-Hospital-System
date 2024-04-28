package com.hadproject.dhanvantari.consent;

import com.hadproject.dhanvantari.doctor.Doctor;
import com.hadproject.dhanvantari.patient.Patient;
import com.hadproject.dhanvantari.visit.Visit;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "consent_request")
public class ConsentRequest {
    @Id
    @GeneratedValue(strategy =  GenerationType.AUTO)
    private Long id;
    @Column
    private String purpose;
    @Column
    private String purposeCode;
    @ManyToOne(cascade = CascadeType.DETACH, fetch = FetchType.EAGER)
    @JoinColumn(name = "patient_id", referencedColumnName = "patientId")
    private Patient patient;
    @ManyToOne(cascade = CascadeType.DETACH, fetch = FetchType.EAGER)
    @JoinColumn(name = "doctor_id", referencedColumnName = "doctorId")
    private Doctor doctor;

    @ManyToOne(cascade = CascadeType.DETACH, fetch = FetchType.EAGER)
    @JoinColumn(name = "visit_id", referencedColumnName = "id")
    private Visit visit;

    @Column
    private String hiTypes;
    @Column
    private String accessMode;
    @Column(nullable = false)
    private String dateFrom;
    @Column(nullable = false)
    private String dateTo;
    @Column(nullable = false)
    private String dataEraseAt;
    @Column(unique = true)
    private String consentRequestId;
    @Column
    private String status;
    @OneToMany(cascade = CascadeType.DETACH, fetch = FetchType.EAGER)
    @JoinColumn(name = "consent_request_id", referencedColumnName = "id")
    List<Consent> consentList = new ArrayList<>();
    @Column
    private String requestId;
}
