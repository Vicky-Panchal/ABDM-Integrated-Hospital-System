package com.hadproject.dhanvantari.appointment.dto;

import com.hadproject.dhanvantari.appointment.AppointmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChangeStatusRequest {
    public AppointmentStatus status;
    public Long slotId;
}
