package com.hadproject.dhanvantari.consent;

import com.hadproject.dhanvantari.care_context.CareContext;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "consent")
public class Consent {
    @Id
    @GeneratedValue(strategy =  GenerationType.AUTO)
    private long id;
    @Column
    private String status;
    @Column(unique = true)
    private String consentId;
    @Column
    private String hiTypes;
    @Column
    private String signature;
    @Column
    private String accessMode;
    @Column
    private String transactionId;
    @Column
    private String receiverPublicKey;
    @Column
    private String receiverPrivateKey;
    @Column
    private String receiverNonce;
    @Column
    private String requestId;
    @OneToMany(cascade = CascadeType.DETACH, fetch = FetchType.EAGER)
    @JoinColumn(name = "consent_id", referencedColumnName = "id")
    List<CareContext> careContextList = new ArrayList<>();

    @Column
    private String dataFrom;

    @Column
    private String dataTo;

    @Column
    private String dataEraseAt;
    @Column
    private String patientReferenceWhenSendingData;
    @Column(nullable = false)
    @CreationTimestamp
    private LocalDateTime created_at;
    @Column()
    private LocalDateTime granted_at;

    public void addCareContext(CareContext careContext) {
        this.careContextList.add(careContext);
    }
}
