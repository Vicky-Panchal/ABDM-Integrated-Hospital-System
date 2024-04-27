package com.hadproject.dhanvantari.consent;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.hadproject.dhanvantari.care_context.CareContext;
import com.hadproject.dhanvantari.doctor.Doctor;
import com.hadproject.dhanvantari.patient.Patient;
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
    private Long consentIdPk;
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

    @OneToMany(cascade = CascadeType.DETACH, fetch = FetchType.EAGER)
    @JoinColumn(name = "consent_id", referencedColumnName = "id")
    List<CareContext> careContextList = new ArrayList<>();

    public void addCareContext(CareContext careContext) {
        this.careContextList.add(careContext);
    }
}
