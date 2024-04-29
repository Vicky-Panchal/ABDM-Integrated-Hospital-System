package com.hadproject.dhanvantari.doctor;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DoctorDTO {
    private Long userId;
    private Long doctorId;
    private String firstName;
    private String middleName;
    private String lastName;
    private String email;
    private String specialization;
    private String hospitalName;
}
