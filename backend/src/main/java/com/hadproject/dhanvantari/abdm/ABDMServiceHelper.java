package com.hadproject.dhanvantari.abdm;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

import static java.util.UUID.randomUUID;


public class ABDMServiceHelper {
    static Logger logger = LoggerFactory.getLogger(ABDMServiceHelper.class);
    public static JSONObject prepareGenerateOTPEntity(String abhaId) {
        logger.info("Entering prepareGenerateOTPEntity with data abhaId: " + abhaId);
        JSONObject request = new JSONObject();
        request.put("requestId", randomUUID());
        request.put("timestamp", ZonedDateTime.now( ZoneOffset.UTC ).format( DateTimeFormatter.ISO_INSTANT ));
        JSONObject query = new JSONObject();
        query.put("id", abhaId);
        query.put("purpose", "KYC_AND_LINK");
        query.put("authMode", "MOBILE_OTP");
        JSONObject requester = new JSONObject();
        requester.put("type", "HIP");
        requester.put("id", "team-29-hip-1");
        query.put("requester", requester);
        request.put("query", query);
        logger.info("Exiting prepareGenerateOTPEntity with data: " + request.toString());
        return request;
    }

    public static HttpHeaders prepareHeader(String authToken) {
        logger.info("Entering prepareHeader()");
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(authToken);
        headers.set("X-CM-ID", "sbx");
        logger.info("Exiting prepareHeader() with headers: {}", headers.toString());
        return headers;
    }

    public static JSONObject prepareConfirmOTPRequest (String txnId, String otp) {
        logger.info("Entering prepareConfirmOTPRequest with data txnId: {} otp: {}", txnId, otp);
        JSONObject request = new JSONObject();
        request.put("requestId", randomUUID());
        request.put("timestamp", ZonedDateTime.now( ZoneOffset.UTC ).format( DateTimeFormatter.ISO_INSTANT ));
        request.put("transactionId", txnId);

        JSONObject credential = new JSONObject();
        credential.put("authCode", otp);

        request.put("credential", credential);
        logger.info("Exiting prepareConfirmOTPRequest with data: " + request.toString());
        return request;
    }
}
