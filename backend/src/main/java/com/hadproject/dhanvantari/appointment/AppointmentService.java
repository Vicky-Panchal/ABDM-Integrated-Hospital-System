package com.hadproject.dhanvantari.appointment;

import com.hadproject.dhanvantari.appointment.dto.AddAppointmentSlotRequest;
import com.hadproject.dhanvantari.doctor.Doctor;
import com.hadproject.dhanvantari.doctor.DoctorRepository;
import com.hadproject.dhanvantari.user.User;
import com.hadproject.dhanvantari.user.UserService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {
    Logger logger = LoggerFactory.getLogger(AppointmentService.class);
    private final AppointmentRepository appointmentRepository;
    private final UserService userService;
    private final AppointmentSlotRepository appointmentSlotRepository;
    private final DoctorRepository doctorRepository;

    public void addAppointmentSlots(AddAppointmentSlotRequest data, Principal connectedUser) {
        List<LocalDate> dates = data.getDate();
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        Doctor doctor = doctorRepository.findDoctorByUser(user);
        for (LocalDate date : dates) {
            addSlots(doctor, date, data.getStartTime(), data.getEndTime());
        }
    }

    public void addSlots(Doctor doctor, LocalDate date, LocalTime startTime, LocalTime endTime) {

        // Check if slots already exist for the given doctor on the given date
        List<AppointmentSlot> existingSlots = appointmentSlotRepository.findByDoctorAndDate(doctor, date);
        if (!existingSlots.isEmpty()) {
            return;
        }

        // Create appointment slots
        List<AppointmentSlot> slots = new ArrayList<>();
        while (startTime.isBefore(endTime)) {
            AppointmentSlot slot = new AppointmentSlot();
            slot.setDoctor(doctor);
            slot.setDate(date);
            slot.setStartTime(startTime);
            slot.setEndTime(startTime.plusMinutes(30)); // Assuming each slot is 30 minutes
            slot.setAvailabilityStatus("available");
            // Set other relevant fields
            slots.add(slot);
            startTime = startTime.plusMinutes(30); // Move to next slot
        }

        appointmentSlotRepository.saveAll(slots);
    }
}
