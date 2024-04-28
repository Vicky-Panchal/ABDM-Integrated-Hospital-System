package com.hadproject.dhanvantari.appointment;

import com.hadproject.dhanvantari.doctor.Doctor;
import com.hadproject.dhanvantari.patient.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByDoctor(Doctor doctor);
    List<Appointment> findByPatient(Patient patient);
    Appointment findBySlotId(Long slotId);
}
