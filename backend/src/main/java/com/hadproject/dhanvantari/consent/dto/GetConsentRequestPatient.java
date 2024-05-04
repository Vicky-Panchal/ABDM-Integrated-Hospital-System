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
public class GetConsentRequestPatient {
    private String consentRequestId;
    private String doctorName;
    private String dateFrom;
    private String dateTo;
    private String dateEraseAt;
    private String purpose;
    private String hiTypes;
    private String status;
    private LocalDateTime createdAt;
//    private String prescription;
//    private String dosageInstruction;
//    private String diagnosis;
//    private String healthRecord;
}
