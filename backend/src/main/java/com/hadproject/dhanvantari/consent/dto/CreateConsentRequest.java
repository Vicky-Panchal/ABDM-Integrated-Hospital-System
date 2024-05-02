package com.hadproject.dhanvantari.consent.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateConsentRequest {
    public String purpose;
    public String dateFrom;
    public String dateTo;
    public String dateEraseAt;
    public String hiTypes;
    public String patientId;
    public String doctorId;
    public String visitId;
}
