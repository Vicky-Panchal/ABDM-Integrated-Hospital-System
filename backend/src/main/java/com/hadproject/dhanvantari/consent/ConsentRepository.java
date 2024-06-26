package com.hadproject.dhanvantari.consent;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ConsentRepository extends JpaRepository<Consent, Long> {
    Consent findConsentByConsentId(String consentId);
    Consent findConsentByRequestId(String RequestId);

    Consent findConsentByTransactionId(String transactionId);
}
