package com.hadproject.dhanvantari.patient.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GetAllPatient {
    private String patientId;
    private String firstName;
    private String middleName;
    private String lastName;
    private String gender;
    private Date dob;
    private String email;
    private String profile;
}
