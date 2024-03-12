package com.hadproject.dhanvantari.consent;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.hadproject.dhanvantari.doctor.Doctor;
import com.hadproject.dhanvantari.patient.Patient;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "consent")
public class Consent {
    @Id
    @SequenceGenerator(
            name = "consent_sequence",
            sequenceName = "consent_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "consent_sequence"
    )
    private int consentIdPK;
    public String purposeText;
    public String consentId;
    public String fromDate;
    public String toDate;
    public String eraseDate;
    public String status;
    public String requestId;
    public String requestedBy;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(
            name = "patient_id_fk",
            referencedColumnName = "patientId"
    )
    public Patient patient;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(
            name = "doctor_id_fk",
            referencedColumnName = "doctorId"
    )
    public Doctor doctor;
}
