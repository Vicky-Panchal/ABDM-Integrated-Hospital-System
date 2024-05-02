package com.hadproject.dhanvantari.consent;

import com.hadproject.dhanvantari.abdm.ABDMService;
import com.hadproject.dhanvantari.abdm.DataEncryptionDecryption;
import com.hadproject.dhanvantari.care_context.CareContext;
import com.hadproject.dhanvantari.care_context.CareContextRepository;
import com.hadproject.dhanvantari.consent.dto.CreateConsentRequest;
import com.hadproject.dhanvantari.doctor.DoctorRepository;
import com.hadproject.dhanvantari.patient.PatientRepository;
import com.hadproject.dhanvantari.visit.Visit;
import com.hadproject.dhanvantari.visit.VisitRepository;
import lombok.RequiredArgsConstructor;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
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
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final ConsentRequestRepository consentRequestRepository;
    private final DataEncryptionDecryption dataEncryptionDecryption;

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
        logger.info("entering saveHIPNotifyConsent with data: {}", notification);
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
        logger.info("care contexts array is : {}", arr.toString());
        logger.info("care contexts array length is :{}", arr.length());
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
            logger.info("converted careContext in HIP Request : {}", careContext);
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
        logger.info("exiting saveHIPNotifyConsentHIP after saving consent: {}", consent);

        return new String[]{consent.getConsentId(), consent.getRequestId()};
    }

    public void fireABDMOnNotify(String[] ids) throws Exception {
        logger.info("entering fireABDMOnNotify with data: {}", Arrays.toString(ids));
        JSONObject request = prepareOnNotifyRequestObject(ids);
        abdmService.setToken();
        HttpHeaders headers = prepareHeader(abdmService.getToken());
        System.out.println(request);
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


    //---------------------------------------------- Consent Request APIs --------------------------------------------

    public ConsentRequest prepareConsentRequest(CreateConsentRequest req) {

        logger.info("Entering prepareConsentRequest with data: {}", req);

//        JSONObject requestObj = new JSONObject(req);
        ConsentRequest consentRequest = new ConsentRequest();
        consentRequest.setPurpose(req.getPurpose());
        consentRequest.setPurposeCode("CAREMGT");

        // TODO: check if converting time is good
        consentRequest.setDateFrom((req.getDateFrom()));
        consentRequest.setDateTo((req.getDateTo()));
        consentRequest.setDataEraseAt((req.getDateEraseAt()));
        consentRequest.setAccessMode("VIEW");

        consentRequest.setHiTypes(req.getHiTypes());
        consentRequest.setPatient(patientRepository.findPatientByPatientId(Long.parseLong(req.getPatientId())));
        consentRequest.setDoctor(doctorRepository.findByDoctorId(Long.parseLong(req.getDoctorId())).orElseThrow(() -> new RuntimeException("Doctor not found")));

        Visit visit = visitRepository.findVisitById(Long.parseLong(req.getVisitId()));

        consentRequest.setVisit(visit);
        visit.addConsentRequest(consentRequest);
        logger.info("Exiting prepareConsentRequest with data if saved");

        return consentRequestRepository.save(consentRequest);
    }

    public String fireABDMConsentRequestInit(ConsentRequest consentRequest) throws Exception {
        logger.info("Entering fireABDMConsentRequestInit with data: " );
        JSONObject requestBody = prepareConsentRequestInIt(consentRequest);
        abdmService.setToken();
        String authToken = abdmService.getToken();
        if (authToken.equals("-1")) return null;

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = prepareHeader(authToken);

        HttpEntity<String> entity = new HttpEntity<String>(requestBody.toString(), headers);
        restTemplate.postForObject("https://dev.abdm.gov.in/gateway/v0.5/consent-requests/init", entity, String.class);
        return requestBody.get("requestId").toString();
    }

    public JSONObject prepareConsentRequestInIt(ConsentRequest consentRequest) {
        logger.info("Entering prepareConsentRequestInIt with data: ");
        JSONObject response = new JSONObject();
        response.put("requestId", randomUUID());
        response.put("timestamp", ZonedDateTime.now( ZoneOffset.UTC ).format( DateTimeFormatter.ISO_INSTANT ));
        response.put("consent", getConsentObjectForInIt(consentRequest));
        consentRequest.setRequestId(response.get("requestId").toString());
        consentRequestRepository.save(consentRequest);
        logger.info("Exiting prepareConsentRequestInIt with data");
        return response;
    }

    public static JSONObject getConsentObjectForInIt(ConsentRequest consentRequest) {
        logger.info("Entering getConsentObjectForInit with data: consentRequest");
        JSONObject consent = new JSONObject();
        consent.put("purpose", new JSONObject());
        consent.getJSONObject("purpose").put("text", consentRequest.getPurpose());
        consent.getJSONObject("purpose").put("code", consentRequest.getPurposeCode());

        consent.put("patient", new JSONObject());
        consent.getJSONObject("patient").put("id", consentRequest.getPatient().getUser().getHealthId());

        consent.put("hiu", new JSONObject());
        consent.getJSONObject("hiu").put("id", "HIU-29-1");

        consent.put("requester", new JSONObject());
        consent.getJSONObject("requester").put("name", consentRequest.getDoctor().getUser().getFirstname() + " " + consentRequest.getDoctor().getUser().getLastname());
        consent.getJSONObject("requester").put("identifier", new JSONObject());
        consent.getJSONObject("requester").getJSONObject("identifier").put("type", "REGNO");
        consent.getJSONObject("requester").getJSONObject("identifier").put("value", consentRequest.getDoctor().getRegistrationNumber());
        consent.getJSONObject("requester").getJSONObject("identifier").put("type", "https://www.mciindia.org");

        consent.put("hiTypes", new JSONArray(consentRequest.getHiTypes()));

        consent.put("permission", new JSONObject());
        consent.getJSONObject("permission").put("accessMode", consentRequest.getAccessMode());
        consent.getJSONObject("permission").put("dataEraseAt", consentRequest.getDataEraseAt());
        consent.getJSONObject("permission").put("dateRange", new JSONObject());
        consent.getJSONObject("permission").getJSONObject("dateRange").put("from", consentRequest.getDateFrom());
        consent.getJSONObject("permission").getJSONObject("dateRange").put("to", consentRequest.getDateTo());

        consent.getJSONObject("permission").put("frequency", new JSONObject());
        consent.getJSONObject("permission").getJSONObject("frequency").put("unit", "HOUR");
        consent.getJSONObject("permission").getJSONObject("frequency").put("value", 1);
        consent.getJSONObject("permission").getJSONObject("frequency").put("repeats", 0);
        logger.info("Exiting getConsentObjectForInIt with data: consent =");
        return consent;
    }
    //--------------------------------------------------------
    public String[] prepareOnConsentRequestInitResponse(String responseBody) {
        logger.info("Entering prepareOnConsentRequestInitResponse with data : {}", responseBody);
        JSONObject obj = new JSONObject(responseBody);
        String requestId = obj.getJSONObject("resp").get("requestId").toString();
        JSONObject response = new JSONObject();
        String[] ans = new String[3];
        ans[0] = requestId;
        if (obj.isNull("error")) {
            response.put("status", HttpStatus.OK);
            response.put("message", "Consent request sent successfully");
            ans[1] = obj.getJSONObject("consentRequest").getString("id");
        }
        else {
            response.put("status", HttpStatus.BAD_REQUEST);
            response.put("message", obj.getJSONObject("error").getString("message"));
            ans[1] = null;
        }
        ans[2] = response.toString();
        return ans;
    }

    public void updateConsentRequestId(String requestId, String consentRequestId) {
        logger.info("Entering updateConsentRequestId with data requestId: {} consentRequestId: {}", requestId, consentRequestId);
        ConsentRequest consentRequest = consentRequestRepository.findConsentRequestByRequestId(requestId);
        consentRequest.setConsentRequestId(consentRequestId);
        consentRequest.setStatus("REQUESTED");
        consentRequestRepository.save(consentRequest);
        logger.info("exiting updateConsentRequestId after saving data: {}", consentRequest);
    }

    public void updateConsentRequestStatusFailed(String requestId) {
        logger.info("Entering updateConsentRequestStatusFailed with data: {}", requestId);
        ConsentRequest consentRequest = consentRequestRepository.findConsentRequestByConsentRequestId(requestId);
        consentRequest.setStatus("FAILED");
        consentRequestRepository.save(consentRequest);
        logger.info("exiting updateConsentRequestStatusFailed after saving consentRequest{}", consentRequest);
    }

    public boolean updateConsentRequestStatus(JSONObject obj) {
        logger.info("entering updateConsentRequestStatus with data: {}", obj);
        String consentRequestId = obj.getJSONObject("notification").getString("consentRequestId");
        String status = obj.getJSONObject("notification").getString("status");
        ConsentRequest consentRequest = consentRequestRepository.findConsentRequestByConsentRequestId(consentRequestId);
        consentRequest.setStatus(status);
        if (status.equals("GRANTED")) {
            for (Object object : obj.getJSONObject("notification").getJSONArray("consentArtefacts")) {
                JSONObject artifactObj = (JSONObject) object;
                Consent consent = new Consent();
                consent.setConsentId(artifactObj.getString("id"));
                consent.setStatus("REQUESTED");
                consentRepository.save(consent);
                consentRequest.addConsent(consent);
            }
        }
        consentRequestRepository.save(consentRequest);
        logger.info("exiting updateConsentRequestStatus after saving consent request: {}", consentRequestId);
        return status.equals("GRANTED");
    }

    public void fireArtifactsFetchRequest(JSONArray arr) throws Exception {
        logger.info("Entering fireArtifactsFetchRequest with data : {}", arr);
        abdmService.setToken();
        String authToken = abdmService.getToken();
        if (authToken.equals("-1")) return;

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = prepareHeader(authToken);
        for (int i = 0; i < arr.length(); i++) {
            JSONObject requestObj = prepareFetchRequestObj(((JSONObject)arr.get(i)).getString("id"));
            HttpEntity<String> entity = new HttpEntity<String>(requestObj.toString(), headers);
            restTemplate.postForObject("https://dev.abdm.gov.in/gateway/v0.5/consents/fetch", entity, String.class);
            Consent consent = consentRepository.findConsentByConsentId(((JSONObject)arr.get(i)).getString("id"));
            consent.setRequestId(requestObj.get("requestId").toString());
            consentRepository.save(consent);
        }
        return;
    }

    public static JSONObject prepareFetchRequestObj(String consentId) {
        logger.info("Entering prepareFetchRequestObj with data: consentId = {}", consentId);
        JSONObject ans = new JSONObject();
        ans.put("requestId", randomUUID());
        ans.put("timestamp", ZonedDateTime.now( ZoneOffset.UTC ).format( DateTimeFormatter.ISO_INSTANT ));
        ans.put("consentId", consentId);
        logger.info("Exiting prepareFetchRequestObj with data: {}", ans.toString());
        return ans;
    }

    public Consent updateConsentRequestAfterOnFetch(JSONObject requestObj) {
        logger.info("Entering updateConsentRequestAfterOnFetch with data:{}", requestObj);
        Consent consent = consentRepository.findConsentByRequestId(requestObj.getJSONObject("resp").get("requestId").toString());
        requestObj = requestObj.getJSONObject("consent");
        consent.setStatus(requestObj.getString("status"));
        consent.setSignature(requestObj.getString("signature"));
        requestObj = requestObj.getJSONObject("consentDetail");
        assert consent.getConsentId().equals(requestObj.getString("consentId"));
        JSONArray careContextArr = requestObj.isNull("careContexts") ? new JSONArray() : requestObj.getJSONArray("careContexts");
        for (int i = 0; i < careContextArr.length(); i++) {
            JSONObject cc = (JSONObject) careContextArr.get(i);
            CareContext careContext = new CareContext(cc.getString("patientReference"), cc.getString("careContextReference"));
            consent.addCareContext(careContext);
            careContextRepository.save(careContext);
        }
        consent.setHiTypes(requestObj.getJSONArray("hiTypes").toString());
        consent.setAccessMode(requestObj.getJSONObject("permission").getString("accessMode"));
        consent.setDataFrom(requestObj.getJSONObject("permission").getJSONObject("dateRange").getString("from"));
        consent.setDataTo(requestObj.getJSONObject("permission").getJSONObject("dateRange").getString("to"));
        consent.setDataEraseAt(requestObj.getJSONObject("permission").getString("dataEraseAt"));
        HashMap<String, String> keys = receiverKeys();
        consent.setReceiverPublicKey(keys.get("publicKey"));
        consent.setReceiverPrivateKey(keys.get("privateKey"));
        consent.setReceiverNonce(keys.get("random"));
        logger.info("exiting updateConsentRequestAfterOnFetch after saving consent{}", consent);
        return consentRepository.save(consent);
    }

    public String fireABDMHealthInformationCMRequest(Consent consent) throws Exception {
        logger.info("entering fireABDMHealthInformationCMRequest with data: {}", consent);
        JSONObject requestBody = prepareHealthInformationCMRequest(consent);
        abdmService.setToken();
        String authToken = abdmService.getToken();
        if (authToken.equals("-1")) return null;

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = prepareHeader(authToken);

        logger.info("requestbody to cm healthrequest{}", requestBody);

        HttpEntity<String> entity = new HttpEntity<String>(requestBody.toString(), headers);
        consent.setRequestId(requestBody.get("requestId").toString());

        consentRepository.save(consent);
        logger.info("exiting after saving data: consent{}", consent);
        logger.info("entity: {}", entity.toString());

        restTemplate.postForObject("https://dev.abdm.gov.in/gateway/v0.5/health-information/cm/request", entity, String.class);
        return requestBody.get("requestId").toString();
    }

    public static JSONObject prepareHealthInformationCMRequest(Consent consent) {
        logger.info("Entering prepareHealthInformationCMRequest with data: consent = {}", consent);
        JSONObject response = new JSONObject();
        response.put("requestId", randomUUID());
        response.put("timestamp", ZonedDateTime.now( ZoneOffset.UTC ).format( DateTimeFormatter.ISO_INSTANT ));
        response.put("hiRequest", new JSONObject());

        response.getJSONObject("hiRequest").put("consent", new JSONObject());
        response.getJSONObject("hiRequest").getJSONObject("consent").put("id", consent.getConsentId());

        response.getJSONObject("hiRequest").put("dateRange", new JSONObject());
        response.getJSONObject("hiRequest").getJSONObject("dateRange").put("from", consent.getDataFrom() + "Z");
        response.getJSONObject("hiRequest").getJSONObject("dateRange").put("to", consent.getDataTo() + "Z");

        response.getJSONObject("hiRequest").put("dataPushUrl", "https://webhook.site/371dd360-f7ca-458e-abaa-b259fd812c26/api/v1/consent/data/push");

        response.getJSONObject("hiRequest").put("keyMaterial", new JSONObject());
        response.getJSONObject("hiRequest").getJSONObject("keyMaterial").put("cryptoAlg", "ECDH");
        response.getJSONObject("hiRequest").getJSONObject("keyMaterial").put("curve", "Curve25519");

        response.getJSONObject("hiRequest").getJSONObject("keyMaterial").put("dhPublicKey", new JSONObject());
        response.getJSONObject("hiRequest").getJSONObject("keyMaterial").getJSONObject("dhPublicKey").put("expiry", "2022-06-05T01:02:03.0009Z");
        response.getJSONObject("hiRequest").getJSONObject("keyMaterial").getJSONObject("dhPublicKey").put("parameters", "Curve25519/32byte random key");
        response.getJSONObject("hiRequest").getJSONObject("keyMaterial").getJSONObject("dhPublicKey").put("keyValue", consent.getReceiverPublicKey());
        response.getJSONObject("hiRequest").getJSONObject("keyMaterial").put("nonce", consent.getReceiverNonce());
        logger.info("exiting prepareHealthInformationCMRequest with data : {}", response);
        return response;
    }

    public void saveData(JSONObject data) {
        logger.info("Entering save data with data: {}", data);
        Consent consent = consentRepository.findConsentByTransactionId(data.getString("transactionId"));
        String senderPublicKey = data.getJSONObject("keyMaterial").getJSONObject("dhPublicKey").getString("keyValue");
        String senderNonce = data.getJSONObject("keyMaterial").getString("nonce");
        String receiverNonce = consent.getReceiverNonce();
        String receiverPrivateKey = consent.getReceiverPrivateKey();
        JSONArray arr = data.getJSONArray("entries");
        List<CareContext> careContexts = consent.getCareContextList();
        for (int i = 0; i < arr.length(); i++) {
            JSONObject obj = arr.getJSONObject(i);
            String careContextReference = obj.getString("careContextReference");

            //     Instead of searching care context don't save care context before instead start storing care context which you received
            //     Cannot do this because when consent is granted we have to check again updated consent parameters.
            String encryptedData = obj.getString("content");
            CareContext tempCareContext = findCareContext(careContexts, careContextReference);
            HashMap<String, String> decodedMsg = updateCareContextData(senderNonce, senderPublicKey, receiverNonce, receiverPrivateKey, encryptedData);
            assert tempCareContext != null;
            assert decodedMsg != null;
            tempCareContext.setDoctorId(decodedMsg.getOrDefault("doctorId", "temp-doctor-id"));
            tempCareContext.setPatientId(decodedMsg.getOrDefault("patientId", "temp-patient-id"));
            tempCareContext.setPatientName(decodedMsg.getOrDefault("patientName", "temp-patient-name"));
            tempCareContext.setDoctorName(decodedMsg.getOrDefault("doctorName", "temp-doctor-name"));
            tempCareContext.setDosageInstruction(decodedMsg.getOrDefault("dosageInstruction", "1 time a day"));
            tempCareContext.setPrescription(decodedMsg.getOrDefault("medicineName", "Paracetamol 650 mg"));
            tempCareContext.setDiagnosis(decodedMsg.getOrDefault("diagnosis", "Fever"));
            careContextRepository.save(tempCareContext);
            logger.info("saving carecontext : {}", tempCareContext);
        }
        consent.setStatus("DELIVERED");
    }

    public static CareContext findCareContext(List<CareContext> list, String careContextName) {
        for (CareContext cc : list) {
            if (cc.getCareContextReference().equals(careContextName)) return cc;
            else return null;
        }
        return null;
    }

    public static HashMap<String, String> updateCareContextData(String senderNonce, String senderPublicKey, String receiverNonce, String receiverPrivateKey, String encryptedData) {
        logger.info("Entering updateCareContextData with data: ");
        logger.info("sender Nonce : {}", senderNonce);
        logger.info("sender Public Key : {}", senderPublicKey);
        logger.info("receiverNonce: {}", receiverNonce);
        logger.info("receiverPrivate Key: {}", receiverPrivateKey);
        logger.info("encrpytedData: {}", encryptedData);
        try {
            String decryptedData = DataEncryptionDecryption.decrypt(encryptedData, senderPublicKey, senderNonce, receiverPrivateKey, receiverNonce);
            logger.info("decrypted data: {}", decryptedData);
            return readFHIRDataAndUpdateCareContext(decryptedData);
        }
        catch (Exception e) {
            System.out.println("Error while decrypting " + e);
            return null;
        }
    }

    public static HashMap<String, String> readFHIRDataAndUpdateCareContext(String decryptedData) {
        logger.info("Entering readFHIRDataAndUpdateCareContext with data: {}", decryptedData);
        JSONObject obj = new JSONObject(decryptedData);
        JSONArray arr = obj.getJSONArray("entry");
        String doctorId = "", patientName = "", doctorName = "", dosageInstructions = "", patientId = "",
                diagnosis = "", medicineName = "";
        for (int i = 0; i < arr.length(); i++) {
            JSONObject temp = arr.getJSONObject(i);
            String[] splitArr = temp.getString("fullUrl").split("/");
            String identifier = splitArr[0];
            if (identifier.equalsIgnoreCase("Practitioner")) {
                temp = temp.getJSONObject("resource");
                doctorId = temp.getString("id");
                doctorName = temp.getJSONArray("name").getJSONObject(0).getString("text");
            } else if (identifier.equalsIgnoreCase("Patient")) {
                patientId = temp.getJSONObject("resource").getString("id");
                patientName = temp.getJSONObject("resource").getJSONArray("name").getJSONObject(0).getString("text");
            } else if (identifier.equalsIgnoreCase("Condition")) {
                diagnosis = temp.getJSONObject("resource").getJSONObject("code").getString("text");
            } else if (identifier.equalsIgnoreCase("Medication")) {
                medicineName = temp.getJSONObject("resource").getJSONObject("code").getString("text");
            } else if (identifier.equalsIgnoreCase("MedicationRequest")) {
                dosageInstructions = temp.getJSONObject("resource").getJSONArray("dosageInstruction").getJSONObject(0)
                        .getString("text");
            } else {
                System.out.println("Found extra data -> " + temp.toString());
            }
        }
        HashMap<String, String> map = new HashMap<>();
        map.put("doctorId", doctorId);
        map.put("doctorName", doctorName);
        map.put("dosageInstruction", dosageInstructions);
        map.put("medicineName", medicineName);
        map.put("diagnosis", diagnosis);
        map.put("patientName", patientName);
        map.put("patientId", patientId);
        logger.info("Exiting readFHIRDataAndUpdateCareContext with data: {}", map);
        return map;
    }
}
