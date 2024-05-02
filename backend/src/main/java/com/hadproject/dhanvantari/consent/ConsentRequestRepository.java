package com.hadproject.dhanvantari.consent;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ConsentRequestRepository extends JpaRepository<ConsentRequest, Long> {
    ConsentRequest findConsentRequestByRequestId(String requestId);
    ConsentRequest findConsentRequestByConsentRequestId(String consentRequestId);
}
