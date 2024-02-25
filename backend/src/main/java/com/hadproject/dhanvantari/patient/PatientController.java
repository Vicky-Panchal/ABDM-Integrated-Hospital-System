package com.hadproject.dhanvantari.patient;

import com.hadproject.dhanvantari.abdm.ABDMService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/patient")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;
    private final ABDMService abdmService;

    @GetMapping
    public String generateOtp() throws Exception {

        return abdmService.getToken();
    }
}
