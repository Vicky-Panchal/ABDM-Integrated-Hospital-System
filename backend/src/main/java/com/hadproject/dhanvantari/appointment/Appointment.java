package com.hadproject.dhanvantari.appointment;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.hadproject.dhanvantari.care_context.CareContext;
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
@Table(name = "appointment")
public class Appointment {
    @Id
    @SequenceGenerator(
            name = "appointment_sequence",
            sequenceName = "appointment_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "appointment_sequence"
    )
    private int appointmentId;

    public String date;

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
    @JsonIgnore
    public Doctor doctor;

    @JsonIgnore
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(
            name = "care_context_id_fk",
            referencedColumnName = "careContextId"
    )
    public CareContext careContext;
}
