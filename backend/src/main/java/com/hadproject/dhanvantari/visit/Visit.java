package com.hadproject.dhanvantari.visit;

import com.hadproject.dhanvantari.consent.ConsentRequest;
import com.hadproject.dhanvantari.doctor.Doctor;
import com.hadproject.dhanvantari.patient.Patient;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.json.JSONObject;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "visit")
public class Visit {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
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
    private String display;
    @ManyToOne(cascade = CascadeType.DETACH, fetch = FetchType.EAGER)
    @JoinColumn(name = "patient_id", referencedColumnName = "patientId")
    private Patient patient;
    @ManyToOne
    @JoinColumn(name = "doctor_id", referencedColumnName = "doctorId")
    private Doctor doctor;

    @Column
    private String requestId;
    @Column
    private boolean isDisabled = false;

    @OneToMany(cascade = CascadeType.DETACH, fetch = FetchType.EAGER)
    List<ConsentRequest> consentRequestList = new ArrayList<>();

    public Visit(LocalDate visitDate, String referenceNumber, String display) {
        this.visitDate = visitDate;
        this.display = display;
        this.referenceNumber = referenceNumber;
    }

    public JSONObject getJSONObject() {
        JSONObject obj = new JSONObject();
        obj.put("id", "" + id);
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
