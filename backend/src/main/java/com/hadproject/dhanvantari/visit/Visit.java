package com.hadproject.dhanvantari.visit;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.hadproject.dhanvantari.care_context.CareContext;
import com.hadproject.dhanvantari.doctor.Doctor;
import com.hadproject.dhanvantari.patient.Patient;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.json.JSONObject;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "visit")
public class Visit {
    @Id
    @SequenceGenerator(
            name = "visit_sequence",
            sequenceName = "visit_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "visit_sequence"
    )
    private int visitId;

    @Column
    private String prescription;
    @Column
    private String dosageInstruction;
    @Column
    private String diagnosis;
    @Column
    private LocalDate visitDate;
    @Column
    private String referenceNumber;
    @Column
    private String requestId;
    @Column
    private boolean isDisabled = false;

    @ManyToOne
    @JoinColumn(
            name = "patient_id_fk",
            referencedColumnName = "patientId"
    )
    @JsonIgnore
    public Patient patient;

    @Column
    private String display;

    @ManyToOne
    @JoinColumn(
            name = "doctor_id_fk",
            referencedColumnName = "doctorId"
    )
    @JsonIgnore
    public Doctor doctor;

    @JsonIgnore
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(
            name = "care_context_id_fk",
            referencedColumnName = "careContextId"
    )
    public CareContext careContext;

    public Visit(LocalDate visitDate, String referenceNumber, String display) {
        this.visitDate = visitDate;
        this.display = display;
        this.referenceNumber = referenceNumber;
    }

    public JSONObject getJSONObject() {
        JSONObject obj = new JSONObject();
        obj.put("id", "" + visitId);
        obj.put("prescription", prescription);
        obj.put("diagnosis", diagnosis);
        obj.put("dosageInstruction", dosageInstruction);
        obj.put("visitDate", visitDate);
        obj.put("referenceNumber", referenceNumber);
        obj.put("display", display);
        obj.put("isDisabled", isDisabled);
        return obj;
    }
}
