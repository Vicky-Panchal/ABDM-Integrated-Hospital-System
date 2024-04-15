package com.hadproject.dhanvantari.user.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@Builder
public class GetUserResponse {
    private String id;
    private String firstname;
    private String middlename;
    private String lastname;
    private String email;
    private String gender;
    private Date dob;
    private String mobile;
    public String healthId;
    public String healthIdNumber;
}
