package com.hadproject.dhanvantari.consent;

import com.hadproject.dhanvantari.abdm.ABDMService;
import com.hadproject.dhanvantari.care_context.CareContext;
import com.hadproject.dhanvantari.care_context.CareContextRepository;
import com.hadproject.dhanvantari.visit.Visit;
import com.hadproject.dhanvantari.visit.VisitRepository;
import lombok.RequiredArgsConstructor;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import static com.hadproject.dhanvantari.abdm.ABDMServiceHelper.prepareHeader;
import static com.hadproject.dhanvantari.abdm.DataEncryptionDecryption.encryptFHIRData;
import static com.hadproject.dhanvantari.abdm.DataEncryptionDecryption.receiverKeys;
import static com.hadproject.dhanvantari.abdm.FHIRJSON.prepareFHIRJSONString;
import static java.util.UUID.randomUUID;

@Service
@RequiredArgsConstructor
public class ConsentService {
    private final ConsentRepository consentRepository;
    private final ConsentHIPRepository consentHIPRepository;
    private final VisitRepository visitRepository;
    private final CareContextRepository careContextRepository;
    private final ABDMService abdmService;
    static Logger logger = LoggerFactory.getLogger(ConsentService.class);
    public static CareContext convertVisitIntoCareContext(Visit visit) {
        logger.info("Entering convertVisitIntoCareContext with data: {}", visit);
        CareContext careContext = new CareContext(visit.getReferenceNumber(), visit.getDisplay());

        careContext.setCareContextReference(visit.getReferenceNumber());
        careContext.setPatientReference(visit.getDisplay());

        careContext.setDiagnosis(visit.getDiagnosis());
        careContext.setPrescription(visit.getPrescription());
        careContext.setDosageInstruction(visit.getDosageInstruction());

        careContext.setDoctorName(visit.getDoctor().getUser().getFirstname() + " " + visit.getDoctor().getUser().getLastname());
        careContext.setDoctorId(String.valueOf(visit.getDoctor().getDoctorId()));
        careContext.setPatientId(String.valueOf(visit.getPatient().getPatientId()));
        careContext.setPatientName(visit.getPatient().getUser().getFirstname() + " " + visit.getPatient().getUser().getLastname());
        logger.info("Exiting convertVisitIntoCareContext with created carecontext: {}", careContext);
        return careContext;
    }

    public static JSONObject prepareOnNotifyRequestObject(String[] ids) {
        logger.info("Entering prepareOnNotifyRequestObject with data{}", Arrays.toString(ids));
        JSONObject response = new JSONObject();

        response.put("resp", new JSONObject());
        response.getJSONObject("resp").put("requestId", ids[1]);

        response.put("acknowledgement", new JSONObject());
        response.getJSONObject("acknowledgement").put("status", "OK");
        response.getJSONObject("acknowledgement").put("consentId", ids[0]);
        logger.info("Exiting prepareOnNotifyRequestObject with data: {}", response);
        return response;
    }

    public static JSONObject prepareRequestAcknowledgementRequest(String txnId, String requestId) {
        logger.info("Entering prepareRequestAcknowledgementRequest with data: txnId: {} requestId: {}", txnId, requestId);
        JSONObject response = new JSONObject();
        response.put("resp", new JSONObject());
        response.getJSONObject("resp").put("requestId", requestId);

        response.put("requestId", randomUUID());
        response.put("timestamp", ZonedDateTime.now( ZoneOffset.UTC ).format( DateTimeFormatter.ISO_INSTANT ));

        response.put("hiRequest", new JSONObject());
        response.getJSONObject("hiRequest").put("transactionId", txnId);
        response.getJSONObject("hiRequest").put("sessionStatus", "ACKNOWLEDGED");
        logger.info("Exiting prepareRequestAcknowledgementRequest with data: {}", response.toString());
        return response;
    }

    public static JSONObject prepareDataToTransfer(ConsentHIP consent, JSONObject requestObj) {
        logger.info("Entering prepareDataToTransfer with data: --\\/---");
        logger.info("Consent : {}", consent);
        logger.info("requestObj: {}", requestObj);
        String txnId = requestObj.getString("transactionId");
        String randomReceiver = requestObj.getJSONObject("hiRequest").getJSONObject("keyMaterial").getString("nonce");
        String receiverPublicKey = requestObj.getJSONObject("hiRequest").getJSONObject("keyMaterial").getJSONObject("dhPublicKey").getString("keyValue");

        if (consent == null) {
            logger.error("consent not found with consent id {}", requestObj.getJSONObject("hiRequest").getJSONObject("consent").getString("id"));
            return null;
        }

        HashMap<String, String> keys = receiverKeys();
        List<CareContext> careContextList = consent.getCareContextList();
        JSONObject dataObject = new JSONObject();
        dataObject.put("pageNumber", 1);
        dataObject.put("pageNumber", 1);
        dataObject.put("transactionId", txnId);
        dataObject.put("keyMaterial", new JSONObject());
        dataObject.getJSONObject("keyMaterial").put("cryptoAlg", "ECDH");
        dataObject.getJSONObject("keyMaterial").put("curve", "Curve25519");
        dataObject.getJSONObject("keyMaterial").put("dhPublicKey", new JSONObject());
        dataObject.getJSONObject("keyMaterial").getJSONObject("dhPublicKey").put("expiry", "2023-06-05T00:00:00.000Z");
        dataObject.getJSONObject("keyMaterial").getJSONObject("dhPublicKey").put("parameters", "Curve25519/32byte random key");
        dataObject.getJSONObject("keyMaterial").getJSONObject("dhPublicKey").put("keyValue", keys.get("publicKey"));
        dataObject.getJSONObject("keyMaterial").put("nonce", keys.get("random"));
        dataObject.put("entries", new JSONArray());

        for (CareContext careContext : careContextList) {
            String fhirData = prepareFHIRJSONString(careContext.getDoctorId(), careContext.getPatientName(), careContext.getDoctorName(), careContext.getDosageInstruction(), careContext.getPatientId(), careContext.getDiagnosis(), careContext.getPrescription());
            String encryptedData = encryptFHIRData(receiverPublicKey, randomReceiver, fhirData, keys.get("privateKey"), keys.get("random"));
            JSONObject entryObject = new JSONObject();
            entryObject.put("content", encryptedData);
            entryObject.put("media", "application/fhir+json");
            entryObject.put("checksum", "string");
            entryObject.put("careContextReference", careContext.getCareContextReference());
            dataObject.getJSONArray("entries").put(entryObject);
        }
        logger.info("Exiting prepareDataToTransfer with data: {}", dataObject);
        return dataObject;
    }

    public static JSONObject prepareDeliveredNotification(JSONObject object, JSONObject requestObj, ConsentHIP consent) {
        logger.info("Entering prepareDeliveredNotification with data: ");
        logger.info("object: {}", object.toString());
        logger.info("requestObj {}", requestObj.toString());
        logger.info("consent {}", consent);
        JSONObject response = new JSONObject();
        response.put("requestId", randomUUID());
        response.put("timestamp", ZonedDateTime.now( ZoneOffset.UTC ).format( DateTimeFormatter.ISO_INSTANT ));
        response.put("notification", new JSONObject());

        response.getJSONObject("notification").put("consentId", requestObj.getJSONObject("hiRequest").getJSONObject("consent").getString("id"));
        response.getJSONObject("notification").put("doneAt", ZonedDateTime.now( ZoneOffset.UTC ).format( DateTimeFormatter.ISO_INSTANT ));
        response.getJSONObject("notification").put("transactionId", object.getString("transactionId"));

        response.getJSONObject("notification").put("notifier", new JSONObject());
        response.getJSONObject("notification").getJSONObject("notifier").put("type", "HIU");
        response.getJSONObject("notification").getJSONObject("notifier").put("id", "HIU-29-1");

        response.getJSONObject("notification").put("statusNotification", new JSONObject());
        response.getJSONObject("notification").getJSONObject("statusNotification").put("sessionStatus", "DELIVERED");
        response.getJSONObject("notification").getJSONObject("statusNotification").put("hipId", "HIP-29-1");
        response.getJSONObject("notification").getJSONObject("statusNotification").put("statusResponses", new JSONArray());
        List<CareContext> list = consent.getCareContextList();
        for (int i = 0; i < list.size(); i++) {
            CareContext cc = list.get(i);
            JSONObject tempObj = new JSONObject();
            tempObj.put("careContextReference", cc.getCareContextReference());
            tempObj.put("hiStatus", "OK");
            tempObj.put("description", "string");
            response.getJSONObject("notification").getJSONObject("statusNotification").getJSONArray("sessionStatus").put(tempObj);
        }
        logger.info("Exiting prepareDeliveredNotification with data: " + response.toString());
        return response;
    }

    public String[] saveHIPNotifyConsent(JSONObject notification) {
        logger.info("entering saveHIPNotifyConsent with data: " + notification);
        ConsentHIP temp = consentHIPRepository.findConsentHIPByConsentId(notification.getJSONObject("notification").getString("consentId"));
        if (temp  != null) {
            temp.setRequestId(notification.get("requestId").toString());
            return new String[]{notification.getJSONObject("notification").getString("consentId"), notification.get("requestId").toString()};
        }

        ConsentHIP consent = new ConsentHIP();
        consent.setRequestId(notification.get("requestId").toString());
        notification = notification.getJSONObject("notification");

        consent.setStatus(notification.getString("status"));
        consent.setConsentId(notification.getString("consentId"));

        notification = notification.getJSONObject("consentDetail");

        JSONArray arr = notification.getJSONArray("careContexts");
        logger.info("care contexts array is : " + arr.toString());
        logger.info("care contexts array length is :" + arr.length());
        for (int i = 0 ; i < arr.length(); i++) {
            JSONObject obj = (JSONObject) arr.get(i);
            Visit visit = visitRepository.findVisitByReferenceNumber(obj.getString("careContextReference"));

            if (visit == null) {
                System.out.println("care context not found " + obj.getString("careContextReference"));
                continue;
            }

            // This indicates that the visit has not been finished; a visit was made, but the patient has not seen the doctor.
            if (!visit.isDisabled()) continue;
            CareContext careContext = convertVisitIntoCareContext(visit);
            logger.info("converted careContext in HIP Request : " + careContext);
            consent.addCareContext(careContext);
            careContextRepository.save(careContext);
        }
        consent.setHiTypes(notification.getJSONArray("hiTypes").toString());
        consent.setAccessMode(notification.getJSONObject("permission").getString("accessMode"));
        consent.setPatientReferenceWhenSendingData(notification.getJSONObject("patient").getString("id"));
        consent.setDataTo(notification.getJSONObject("permission").getJSONObject("dateRange").getString("to"));
        consent.setDataFrom(notification.getJSONObject("permission").getJSONObject("dateRange").getString("from"));
        consent.setDataEraseAt(notification.getJSONObject("permission").getString("dataEraseAt"));
        consentHIPRepository.save(consent);
        logger.info("exiting saveHIPNotifyConsentHIP after saving consent: " + consent);

        return new String[]{consent.getConsentId(), consent.getRequestId()};
    }

    public void fireABDMOnNotify(String[] ids) throws Exception {
        logger.info("entering fireABDMOnNotify with data: {}", Arrays.toString(ids));
        JSONObject request = prepareOnNotifyRequestObject(ids);
        abdmService.setToken();
        HttpHeaders headers = prepareHeader(abdmService.getToken());

        RestTemplate restTemplate = new RestTemplate();
        HttpEntity<String> entity = new HttpEntity<String>(request.toString(), headers);
        restTemplate.postForObject("https://dev.abdm.gov.in/gateway/v0.5/consents/hip/on-notify", entity, String.class);
    }

    public void fireABDMRequestAcknowledgement(JSONObject requestObj) throws Exception {
        logger.info("entering fireABDMRequestAcknowledgement with data: {}", requestObj);
        String txnId = requestObj.getString("transactionId");
        String requestId = requestObj.get("requestId").toString();

        JSONObject responseObj = prepareRequestAcknowledgementRequest(txnId, requestId);
        abdmService.setToken();
        HttpHeaders headers = prepareHeader(abdmService.getToken());

        HttpEntity<String> entity = new HttpEntity<>(responseObj.toString(), headers);
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.postForObject("https://dev.abdm.gov.in/gateway/v0.5/health-information/hip/on-request", entity, String.class);
    }

    public JSONObject prepareAndSendData(JSONObject requestObj) throws Exception {
        logger.info("entering prepareAndSendData with data: " + requestObj);
        ConsentHIP consentHIP = consentHIPRepository.findConsentHIPByConsentId(requestObj.getJSONObject("hiRequest").getJSONObject("consent").getString("id"));
        JSONObject object = prepareDataToTransfer(consentHIP, requestObj);
        String dataPushUrl = requestObj.getJSONObject("hiRequest").getString("dataPushUrl");
        abdmService.setToken();
        HttpHeaders headers = prepareHeader(abdmService.getToken());

        HttpEntity<String> entity = new HttpEntity<>(object.toString(), headers);
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.postForObject(dataPushUrl, entity, String.class);
        return object;
    }
    public void sendDataTransferCompletedNotification(JSONObject object, JSONObject requestObj) throws Exception {
        logger.info("entering sendDataTransferCompletedNotification with data: ");
        logger.info("object : " + object.toString());
        logger.info("requestObj: "+ requestObj);

        ConsentHIP consent = consentHIPRepository.findConsentHIPByConsentId(requestObj.getJSONObject("hiRequest").getJSONObject("consent").getString("id"));
        JSONObject obj = prepareDeliveredNotification(object, requestObj, consent);
        abdmService.setToken();
        HttpHeaders headers = prepareHeader(abdmService.getToken());
        HttpEntity<String> entity = new HttpEntity<>(obj.toString(), headers);
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.postForObject("https://dev.abdm.gov.in/gateway/v0.5/health-information/notify", entity, String.class);
    }
}
