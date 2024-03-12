package com.hadproject.dhanvantari.patient;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateHealthIdByAadhaarRequest {
    private boolean consent;
    private String consentVersion;
    private String txnId;
}
