package com.hadproject.dhanvantari.doctor;


import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.hadproject.dhanvantari.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "registrationNumber_unique",
                        columnNames = "registrationNumber"
                )

        }
)
public class Doctor {
    @Id
    @SequenceGenerator(
            name = "doctor_sequence",
            sequenceName = "doctor_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "doctor_sequence"
    )
    private Long doctorId;

    public String registrationNumber;

    // Add more fields for doctor details
    private String specialization;
    private String qualifications;
    private String hospitalName;

    @OneToOne(
            cascade = CascadeType.ALL,
            optional = false
    )
    @JoinColumn(
            name="user_id_fk",
            referencedColumnName="userId"
    )
    @JsonManagedReference(value = "doctorBackRef")
    public User user;
}
