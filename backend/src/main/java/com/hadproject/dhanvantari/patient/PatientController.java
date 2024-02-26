package com.hadproject.dhanvantari.patient;

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

    public void verifyOtp(@RequestBody VerifyOtpRequest data) throws Exception {
        
    }
}
