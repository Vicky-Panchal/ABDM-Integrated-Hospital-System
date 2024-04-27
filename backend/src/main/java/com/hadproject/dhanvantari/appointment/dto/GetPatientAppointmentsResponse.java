package com.hadproject.dhanvantari.appointment.dto;

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
public class GetPatientAppointmentsResponse {
    public Long appointmentId;
    public Long slotId;
    public String doctorName;
    public LocalDate appointmentDate;
    public LocalTime appointmentTime;
    public String status;
}
