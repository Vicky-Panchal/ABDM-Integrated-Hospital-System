package com.hadproject.dhanvantari.patient.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CheckAndGenerateMobileOtpResponse {
    private String txnId;
    private boolean mobileLinked;
}
