package com.hadproject.dhanvantari.patient;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.hadproject.dhanvantari.abdm.ABDMService;
import io.jsonwebtoken.io.IOException;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClientException;


@RestController
@RequestMapping("/api/v1/patient")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class PatientController {

    private final PatientService patientService;


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
    public byte[] getCard(@RequestParam String token) throws RestClientException, IOException, Exception {
        return patientService.getCard(token);
    }
}
