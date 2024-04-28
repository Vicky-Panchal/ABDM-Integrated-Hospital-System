package com.hadproject.dhanvantari.appointment;

import com.hadproject.dhanvantari.doctor.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AppointmentSlotRepository extends JpaRepository<AppointmentSlot, Long> {
    List<AppointmentSlot> findByDoctorAndAvailabilityStatus(Doctor doctor, String availabilityStatus);

    List<AppointmentSlot> findByDoctorAndDate(Doctor doctor, LocalDate date);

}
