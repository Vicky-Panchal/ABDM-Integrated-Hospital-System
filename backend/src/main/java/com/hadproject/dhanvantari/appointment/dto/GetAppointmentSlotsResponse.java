package com.hadproject.dhanvantari.appointment.dto;

import com.hadproject.dhanvantari.appointment.AppointmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GetAppointmentSlotsResponse {
    public Long id;
    public Long doctorId;
    public LocalDate date;
    public LocalTime startTime;
    public LocalTime endTime;
    public AppointmentStatus availabilityStatus;
}
