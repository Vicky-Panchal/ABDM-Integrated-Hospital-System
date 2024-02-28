package com.hadproject.dhanvantari.patient;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.hadproject.dhanvantari.abdm.ABDMService;
import io.jsonwebtoken.io.IOException;
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


    @PostMapping("/generateOtp")
    public GenerateOtpResponse generateOtp(@RequestBody GenerateOtpRequest data) throws Exception {
        return patientService.generateOtp(data.aadhaar);
    }

    @PostMapping("/verifyOtp")
    public VerifyOtpResponse verifyOtp(@RequestBody VerifyOtpRequest data) throws Exception, JsonProcessingException {
        return patientService.verifyOtp(data);
    }

    @PostMapping("/checkAndGenerateMobileOTP")
    public CheckAndGenerateMobileOtpResponse CheckAndGenerateMobileOtp(@RequestBody CheckAndGenerateMobileOtpRequest data) throws Exception, JsonProcessingException {
        System.out.println(data);
        return patientService.CheckAndGenerateMobileOtp(data);
    }

    @PostMapping("/createHealthIdByAdhaar")
    public CreateHealthIdByAadhaarResponse createHealthIdByAadhaar(@RequestBody CreateHealthIdByAadhaarRequest data) throws Exception, JsonProcessingException {
        return patientService.createHealthIdByAadhaar(data);
    }

    public byte[] getCard(@RequestParam String token) throws RestClientException, IOException, Exception {
        return patientService.getCard(token);
    }
}
