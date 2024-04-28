package com.hadproject.dhanvantari.consent;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ConsentHIPRepository extends JpaRepository<ConsentHIP, Long> {
    ConsentHIP findConsentHIPByConsentId(String consentId);
    ConsentHIP findConsentByRequestId(String RequestId);
    ConsentHIP findConsentByTransactionId(String transactionId);
}
