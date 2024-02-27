package com.hadproject.dhanvantari.patient;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.hadproject.dhanvantari.abdm.ABDMService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/patient")
@RequiredArgsConstructor
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
    public CheckAndGenerateMobileOtpResponse CheckAndGenerateMobileOtp(CheckAndGenerateMobileOtpRequest data) throws Exception, JsonProcessingException {
        return patientService.CheckAndGenerateMobileOtp(data);
    }

    @PostMapping("/createHealthIdByAdhaar")
    public CreateHealthIdByAadhaarResponse createHealthIdByAadhaar(CreateHealthIdByAadhaarRequest data) throws Exception, JsonProcessingException {
        return patientService.createHealthIdByAadhaar(data);
    }


}
