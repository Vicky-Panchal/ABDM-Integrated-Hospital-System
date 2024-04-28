package com.hadproject.dhanvantari.appointment;

import com.hadproject.dhanvantari.appointment.dto.AddAppointmentSlotRequest;
import com.hadproject.dhanvantari.appointment.dto.ChangeStatusRequest;
import com.hadproject.dhanvantari.appointment.dto.GetAppointmentSlotsResponse;
import com.hadproject.dhanvantari.appointment.dto.GetPatientAppointmentsResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/appointment")
@RequiredArgsConstructor
public class AppointmentController {
    private final AppointmentService appointmentService;


    @PostMapping("/addSlots")
    @PreAuthorize("hasRole('DOCTOR')")
    public String addSlot(@RequestBody AddAppointmentSlotRequest slots, Principal connectedUser) {
        appointmentService.addAppointmentSlots(slots, connectedUser);
        return "Slots added successfully";
    }

    @GetMapping("/getSlotsByDoctorId")
    public List<GetAppointmentSlotsResponse> getSlotsByDoctorId(@RequestParam("userId") Long userId, @RequestParam("date") LocalDate date) {
        return appointmentService.getSlotsByDoctorId(userId, date);
    }

    @PostMapping("/bookAppointment")
    @PreAuthorize("hasRole('PATIENT')")
    public String bookAppointment(@RequestParam("slotId") Long slotId, Principal connectedUser) {
        appointmentService.bookAppointment(slotId, connectedUser);
        return "Appointment booked successfully";
    }

    @PostMapping("/changeStatus")
    public String changeStatus(ChangeStatusRequest data) {
        appointmentService.changeStatus(data);
        return "Status changed successfully";
    }

    @GetMapping("/getPatientAppointments")
    @PreAuthorize("hasRole('PATIENT')")
    public List<GetPatientAppointmentsResponse> getPatientAppointments(Principal connectedUser) {
        return appointmentService.getPatientAppointments(connectedUser);
    }
}
