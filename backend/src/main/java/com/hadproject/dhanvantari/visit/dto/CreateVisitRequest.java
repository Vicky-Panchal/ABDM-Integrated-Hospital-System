package com.hadproject.dhanvantari.visit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateVisitRequest {
    public String diagnosis;
    public String dosageInstruction;
    public String prescription;
    public String healthRecord;
    public String patientId;
    public String patientAuthToken;
}
