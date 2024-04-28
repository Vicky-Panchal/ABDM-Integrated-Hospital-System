package com.hadproject.dhanvantari.appointment.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AddAppointmentSlotRequest {
    private List<LocalDate> date;
    private LocalTime startTime;
    private LocalTime endTime;
}
