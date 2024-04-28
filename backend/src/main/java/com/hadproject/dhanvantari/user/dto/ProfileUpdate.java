package com.hadproject.dhanvantari.user.dto;

import com.hadproject.dhanvantari.user.Role;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileUpdate {
    private String firstname;
    private String middlename;
    private String lastname;
    private String gender;
    private Date dob;
    private String mobile;
}






