package com.hadproject.dhanvantari.appointment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BookAppointmentRequest {
    private Long slotId;
    private String purpose;
}
