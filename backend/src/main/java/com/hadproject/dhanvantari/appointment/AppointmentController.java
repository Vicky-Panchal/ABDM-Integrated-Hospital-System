package com.hadproject.dhanvantari.appointment;

import com.hadproject.dhanvantari.appointment.dto.AddAppointmentSlotRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/appointment")
@RequiredArgsConstructor
public class AppointmentController {
    private final AppointmentService appointmentService;

    @PostMapping("/addSlots")
    public String addSlot(@RequestBody AddAppointmentSlotRequest slots, Principal connectedUser) {
        appointmentService.addAppointmentSlots(slots, connectedUser);
        return "Slots added successfully";
    }
}
