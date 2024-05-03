package com.hadproject.dhanvantari.consent.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GetConsentRequestResponse {
    private String consentId;
    private String patientName;
    private String abhaId;
    private String consentStatus;
    private LocalDateTime consentCreationDate;
    private LocalDateTime consentGrantDate;
    private String consentExpiryDate;
}
