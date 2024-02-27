package com.hadproject.dhanvantari.patient;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CheckAndGenerateMobileOtpRequest {
    private String mobile;
    private String txnId;
}
