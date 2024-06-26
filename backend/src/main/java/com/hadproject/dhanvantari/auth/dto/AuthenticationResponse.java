package com.hadproject.dhanvantari.auth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.hadproject.dhanvantari.user.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponse {

  @JsonProperty("access_token")
  private String accessToken;
  @JsonProperty("refresh_token")
  private String refreshToken;

  @JsonProperty("first_name")
  private String firstName;

  @JsonProperty("last_name")
  private String lastName;

  @JsonProperty("user_id")
  private Long userId;

  @JsonProperty("doctor_id")
  private Long doctorId;

  @JsonProperty("patient_id")
  private Long patientId;

  @JsonProperty("role")
  private Role role;
}
