package com.hadproject.dhanvantari.patient;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.hadproject.dhanvantari.abdm.ABDMService;
import com.hadproject.dhanvantari.patient.dto.*;
import io.jsonwebtoken.io.IOException;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClientException;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.HashMap;
import java.util.List;


@RestController
@RequestMapping("/api/v1/patient")
@RequiredArgsConstructor
//@CrossOrigin(origins = "*", allowedHeaders = "*")
public class PatientController {
    Logger logger = LoggerFactory.getLogger(PatientController.class);
    private final PatientService patientService;
    private final ABDMService abdmService;

    private static final HashMap<String, SseEmitter> emittersMap = new HashMap<>();

    @Operation(summary = "Sends OTP to the aadhaar linked mobile")
    @PostMapping("/generateOtp")
    public GenerateOtpResponse generateOtp(@RequestBody GenerateOtpRequest data) throws Exception {
        return patientService.generateOtp(data.aadhaar);
    }

    @Operation(summary = "Verifies OTP for the aadhaar linked mobile")
    @PostMapping("/verifyOtp")
    public VerifyOtpResponse verifyOtp(@RequestBody VerifyOtpRequest data) throws Exception, JsonProcessingException {
        return patientService.verifyOtp(data);
    }

    @Operation(summary = "Checks if aadhaar is linked with mobile number")
    @PostMapping("/checkAndGenerateMobileOTP")
    public CheckAndGenerateMobileOtpResponse CheckAndGenerateMobileOtp(@RequestBody CheckAndGenerateMobileOtpRequest data) throws Exception, JsonProcessingException {
        System.out.println(data);
        return patientService.CheckAndGenerateMobileOtp(data);
    }

    @Operation(summary = "Creates Health Id for the aadhaar verified user")
    @PostMapping("/createHealthIdByAdhaar")
    public CreateHealthIdByAadhaarResponse createHealthIdByAadhaar(@RequestBody CreateHealthIdByAadhaarRequest data) throws Exception, JsonProcessingException {
        return patientService.createHealthIdByAadhaar(data);
    }

    @Operation(summary = "Download ABHA card in PDF format")
    @GetMapping("/getCard")
    public byte[] getCard(@RequestParam String token, @RequestHeader("Authorization") String authorizationHeader) throws RestClientException, IOException, Exception {
        authorizationHeader = authorizationHeader.substring(7);
        return patientService.getCard(token, authorizationHeader);
    }

    @Operation(summary = "Abha Verification Using Mobile")
    @GetMapping("/verifyAbhaUsingMobile")
    SseEmitter generateOTP(@RequestParam("abha_id") String abhaId) throws Exception {
        logger.info("Entering generateOTP with request param abhaId as {}", abhaId);
        logger.info("currently map is {}", emittersMap);
        SseEmitter sseEmitter = new SseEmitter(Long.MAX_VALUE);

        String reqId = abdmService.patientInitUsingMobile(abhaId);

        if (reqId == null) {
            throw new RuntimeException("Please try again");
        }

        try {
            sseEmitter.send(SseEmitter.event().name("generate-otp"));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        /*
            TODO:
                Do something about this.
                if session token not received, code do not know what to do.
         */
        emittersMap.put(reqId, sseEmitter);
        return sseEmitter;
    }

    @PostMapping("/v0.5/users/auth/on-init")
    public void onGenerateOTP(@RequestBody String response) {
        logger.info("Entering onGenerateOTP with data: " + response);
        String[] respond = abdmService.prepareOnGenerateResponse(response);
        SseEmitter emitter = emittersMap.get(respond[0]);
        try {
            emitter.send(SseEmitter.event().name("on-init").data(respond[1]));
            emitter.complete();
            emittersMap.remove(respond[0]);
        }
        catch (Exception e) {
            System.out.println(e);
            emitter.complete();
            emittersMap.remove(respond[0]);
        }
        System.out.println("************************************");
    }

    @GetMapping("/confirm-otp")
    public SseEmitter confirmOTP(@RequestParam("transactionId") String transactionId, @RequestParam("otp") String otp) throws Exception {
        logger.info("Entering confirmOTP with transactionId: " + transactionId + " otp: " + otp);

        SseEmitter sseEmitter = new SseEmitter(Long.MAX_VALUE);
        try {
            sseEmitter.send(SseEmitter.event().name("confirm-otp"));
        } catch (IOException | java.io.IOException e) {
            throw new RuntimeException(e);
        }

        String requestId = abdmService.patientConfirmOTP(transactionId, otp);

        emittersMap.put(requestId, sseEmitter);
        return sseEmitter;
    }

    @PostMapping("/v0.5/users/auth/on-confirm")
    public void onConfirmOTP(@RequestBody String response) {
        logger.info("Entering onConfirmOTP with data: " + response);
        JSONObject obj = new JSONObject(response);
        String requestId = obj.getJSONObject("resp").get("requestId").toString();
        logger.info("requestId is : " + requestId);
        logger.info("map has currently: " + emittersMap);
        SseEmitter emitter = emittersMap.get(requestId);
        try {
            JSONObject responseObje = patientService.prepareOnConfirmOTPResponse(response);
            emitter.send(SseEmitter.event().name("on-confirm").data(responseObje.toString()));
            logger.info("sent data to client");
            emitter.complete();
            emittersMap.remove(requestId);
        }
        catch (Exception e) {
            logger.error("Error occurred while in sending data: " + e);
            emitter.complete();
            emittersMap.remove(requestId);
        }
    }

//    @CrossOrigin
    @PostMapping("/v0.5/users/auth/on-fetch-modes")
    public void onFetchModes(@RequestBody String response) {
        logger.info("Entering Fetch Modes with data: {}", response);
    }

//    @PostMapping("/create")
//    public ResponseEntity<?> createPatient(@RequestBody PatientCreateRequest request) {
//        return ResponseEntity.ok(patientService.createPatient(request));
//    }

    @GetMapping("/getAllPatients")
    public ResponseEntity<List<GetAllPatient>> getAllPatients() {
        return ResponseEntity.ok(patientService.getAllPatients());
    }
}
