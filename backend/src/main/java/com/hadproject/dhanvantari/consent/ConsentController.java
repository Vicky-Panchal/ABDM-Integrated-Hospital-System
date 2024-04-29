package com.hadproject.dhanvantari.consent;

import com.hadproject.dhanvantari.consent.dto.CreateConsentRequest;
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
//    @CrossOrigin
    public void hipNotify(@RequestBody String str) throws Exception {
        JSONObject requestBody = new JSONObject(str);
        logger.info("Entering /v0.5/consents/hip/notify with data: {}", requestBody);

        String[] ids = consentService.saveHIPNotifyConsent(requestBody);

        consentService.fireABDMOnNotify(ids);

        logger.info("Exiting hip notify");
    }

    @PostMapping("/v0.5/health-information/hip/request")
//    @CrossOrigin
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
//    @CrossOrigin
    public SseEmitter consentRequestInit(@RequestBody CreateConsentRequest request) throws Exception {

        logger.info("Entering /create-consent-request with requestBody: ");
        logger.info("currently emitter map is {}", map);
        request.setHiTypes("[" + request.getHiTypes() + "]");

        ConsentRequest consentRequest = consentService.prepareConsentRequest(request.toString());
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
}
