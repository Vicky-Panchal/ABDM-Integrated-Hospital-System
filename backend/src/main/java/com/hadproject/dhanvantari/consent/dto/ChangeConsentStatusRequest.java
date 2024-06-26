package com.hadproject.dhanvantari.consent.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChangeConsentStatusRequest {
    private Long consentRequestId;
    private String consentStatus;
}
