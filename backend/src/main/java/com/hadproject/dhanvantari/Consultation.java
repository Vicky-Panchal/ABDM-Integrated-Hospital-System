package com.hadproject.dhanvantari;

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
@Table(name = "consultation")
public class Consultation {
    @Id
    @SequenceGenerator(
            name = "consultation_sequence",
            sequenceName = "consultation_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "consultation_sequence"
    )
    private int consultationId;


    @Lob
    @Column(name = "health_record",length=16777214)
    public byte[] healthRecord;
    public String reasonOfConsultation;
    public String diagnosis;
    public String dateOfConsultation;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(
            name = "patient_id_fk",
            referencedColumnName = "patientId"
    )
    public Patient patient;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(
            name = "doctor_id_fk",
            referencedColumnName = "doctorId"
    )
    public Doctor doctor;
}
