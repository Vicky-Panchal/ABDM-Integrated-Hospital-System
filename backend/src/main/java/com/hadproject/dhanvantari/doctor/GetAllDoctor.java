package com.hadproject.dhanvantari.doctor;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GetAllDoctor {
    private String doctorId;
    private String firstName;
    private String middleName;
    private String lastName;
    private String profile;
    private String email;
    private String gender;
    private Date dob;
    private String specialization;
    private String qualification;
    private String hospitalName;
}
