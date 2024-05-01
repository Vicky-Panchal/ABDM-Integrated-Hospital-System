package com.hadproject.dhanvantari.patient;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.hadproject.dhanvantari.user.User;
import com.hadproject.dhanvantari.visit.Visit;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table()
public class Patient {
    @Id
    @SequenceGenerator(
            name = "patient_sequence",
            sequenceName = "patient_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "patient_sequence"
    )
    public Long patientId;

    @OneToOne(
            cascade = CascadeType.ALL,
            optional = false
    )
    @JoinColumn(
            name = "user_id_fk",
            referencedColumnName = "userId"
    )
    @JsonManagedReference(value = "patientBackRef")
    public User user;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "patient", cascade = CascadeType.DETACH)
    private List<Visit> visits = new ArrayList<>();

    public String getPatientJSONObject() {
        return null;
    }

    public void addVisits(Visit visit) {
        this.visits.add(visit);
        visit.setPatient(this);
    }


}
