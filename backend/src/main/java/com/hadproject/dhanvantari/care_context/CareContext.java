package com.hadproject.dhanvantari.care_context;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.hadproject.dhanvantari.visit.Visit;
import com.hadproject.dhanvantari.doctor.Doctor;
import com.hadproject.dhanvantari.patient.Patient;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class CareContext {

    @Id
    @SequenceGenerator(
            name = "care_context_sequence",
            sequenceName = "care_context_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "care_context_sequence"
    )
    private int careContextId;
    public String display;

    @ManyToOne
    @JoinColumn(
            name = "patient_id_fk",
            referencedColumnName = "patientId"
    )
    @JsonIgnore
    public Patient patient;
    @ManyToOne
    @JoinColumn(
            name = "doctor_id_fk",
            referencedColumnName = "doctorId"
    )
    public Doctor doctor;

    @OneToMany(mappedBy = "careContext",cascade = CascadeType.ALL)
    List<Visit> appointmentlist;
}
