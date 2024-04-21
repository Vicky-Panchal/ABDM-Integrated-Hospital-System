package com.hadproject.dhanvantari.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResetPasswordRequest {
    private String otp;
    private String email;

    @NotBlank(message = "New password cannot be blank")
    private String newPassword;
}
