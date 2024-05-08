package com.hadproject.dhanvantari.visit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GetVisitByDoctorResponse {
    public String visitId;
    private String prescription;
    private String dosageInstruction;
    private String diagnosis;
    private LocalDate visitDate;
    public String healthRecord;
    private String display;
    private String patientId;
    private String patientName;
}
