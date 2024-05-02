package com.hadproject.dhanvantari.consent;

import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.HashMap;

@RestController
@RequestMapping("/api/v1/consent")
@RequiredArgsConstructor
public class ConsentController {
    Logger logger = LoggerFactory.getLogger(ConsentController.class);
    private final ConsentService consentService;
    HashMap<String, SseEmitter> map = new HashMap<>();

    @PostMapping("/v0.5/consents/hip/notify")
    public void hipNotify(@RequestBody String str) throws Exception {
        JSONObject requestBody = new JSONObject(str);
        logger.info("Entering /v0.5/consents/hip/notify with data: {}", requestBody);

        String[] ids = consentService.saveHIPNotifyConsent(requestBody);

        consentService.fireABDMOnNotify(ids);

        logger.info("Exiting hip notify");
    }

    @PostMapping("/v0.5/health-information/hip/request")
    public void dataTransferRequest(@RequestBody String str) throws Exception {
        JSONObject requestObj = new JSONObject(str);
        logger.info("Entering /v0.5/health-information/hip/request with data: {}", requestObj);

        // dataTransferService.fireABDMRequestAcknowledgement(requestObj);

        JSONObject obj = consentService.prepareAndSendData(requestObj);

        logger.info("sent data to consent request: {}", obj.toString());

        // dataTransferService.sendDataTransferCompletedNotification(obj, requestObj);

        logger.info("Exiting dataTransferRequest");
    }

    //--------------------------------------------- Consent Request APIs -----------------------------------------

    @GetMapping("/create-consent-request")
    public SseEmitter consentRequestInit(@RequestParam("purpose") String purpose,
                                         @RequestParam("dateFrom") String dateFrom,
                                         @RequestParam("dateTo") String dateTo,
                                         @RequestParam("dateEraseAt") String dateEraseAt,
                                         @RequestParam("hiTypes") String hiTypes,
                                         @RequestParam("patientId") String patientId,
                                         @RequestParam("doctorId") String doctorId,
                                         @RequestParam("visitId") String visitId) throws Exception {

        logger.info("Entering /create-consent-request with requestBody: ");
        logger.info("currently emitter map is {}", map);
        JSONObject req = new JSONObject();
        req.put("purpose", purpose);
        req.put("dateFrom", dateFrom);
        req.put("dateTo", dateTo);
        req.put("dateEraseAt", dateEraseAt);
        req.put("hiTypes", "[" + hiTypes + "]");
        req.put("patientId", patientId);
        req.put("doctorId", doctorId);
        req.put("visitId", visitId);

        ConsentRequest consentRequest = consentService.prepareConsentRequest(req.toString());
        logger.info("Prepared consent");
        if (consentRequest == null) throw new RuntimeException();
        String requestId = consentService.fireABDMConsentRequestInit(consentRequest);

        SseEmitter sseEmitter = new SseEmitter();
        try {
            logger.info("sending event name consent-request-init");
            sseEmitter.send(SseEmitter.event().name("consent-request-init"));
            logger.info("sent event name consent-request-init");
        } catch (Exception e) {
            logger.error("Exception occurred while sending event: {}", e);
        }
        map.put(requestId, sseEmitter);
        logger.info("Exiting /create-consent-request class and sending sseEmitter");
        return sseEmitter;
    }

    @PostMapping("/v0.5/consent-requests/on-init")
    public void onConsentRequestInit(@RequestBody String responseBody) {
        logger.info("Entering /v0.5/consent-requests/on-init with responseBody: {}", responseBody);
        logger.info("currently emitter map is {}", map);
        String[] response = consentService.prepareOnConsentRequestInitResponse(responseBody);
        SseEmitter sseEmitter = map.get(response[0]);
        if (response[1] == null) {
            consentService.updateConsentRequestStatusFailed(response[0]);
        }
        else {
            consentService.updateConsentRequestId(response[0], response[1]);
        }
        try {
            sseEmitter.send(SseEmitter.event().name("consent-request-on-init").data(response[2]));
        }
        catch (Exception e) {
            logger.error("Error occurred while sending emitter: {}", e);
            sseEmitter.complete();
            map.remove(response[0]);
        }
        logger.info("Exiting /v0.5/consent-requests/on-init");
    }

    @PostMapping("/v0.5/consents/hiu/notify")
    public void hiuConsentNotify(@RequestBody String str) throws Exception {
        JSONObject requestBody = new JSONObject(str);
        logger.info("Entering /v0.5/consents/hiu/notify with requestBody: {}", requestBody);
        boolean consentGranted = consentService.updateConsentRequestStatus(requestBody);
        logger.info("Consent granted = {}", consentGranted);
        if (consentGranted) consentService.fireArtifactsFetchRequest(requestBody.getJSONObject("notification").getJSONArray("consentArtefacts"));
        logger.info("Exiting /v0.5/consents/hiu/notify");
    }

    @PostMapping("/v0.5/consents/on-fetch")
    public void onFetch(@RequestBody String str) throws Exception {
        JSONObject requestBody = new JSONObject(str);
        logger.info("Entering /v0.5/consents/on-fetch with requestBody: {}", requestBody);
        Consent consent = consentService.updateConsentRequestAfterOnFetch(requestBody);
        consentService.fireABDMHealthInformationCMRequest(consent);
        logger.info("Exiting /v0.5/consents/on-fetch");
    }

    @PostMapping("/data/push")
    public void dataPush(@RequestBody String str) {
        JSONObject data = new JSONObject(str);
        logger.info("Entering /data/push with data: {}", data);
        consentService.saveData(data);
        logger.info("exiting /data/pus");
    }
}
