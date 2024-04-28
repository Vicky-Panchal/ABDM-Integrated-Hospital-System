package com.hadproject.dhanvantari.consent;

import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/consent")
@RequiredArgsConstructor
public class ConsentController {
    Logger logger = LoggerFactory.getLogger(ConsentController.class);
    private final ConsentService consentService;

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
}
