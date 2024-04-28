package com.hadproject.dhanvantari.care_context;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class CareContext {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column
    private String patientReference;
    @Column
    private String careContextReference;
    @Column
    private String data;
    @Column
    private String encryptedData;
    @Column
    private String checkSum;
    @Column
    private String prescription;
    @Column
    private String diagnosis;
    @Column
    private String dosageInstruction;
    @Column
    private String patientName;

    @Column
    private String patientId;

    @Column
    private String doctorId;

    @Column
    String doctorName;

    public CareContext(String patientReference, String careContextReference) {
        this.careContextReference = careContextReference;
        this.patientReference = patientReference;
    }
}
