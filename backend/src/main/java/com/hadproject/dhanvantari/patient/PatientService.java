package com.hadproject.dhanvantari.patient;

import com.hadproject.dhanvantari.abdm.ABDMService;
import com.hadproject.dhanvantari.abdm.AadhaarValidationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final ABDMService abdmService;
    private final AadhaarValidationService aadhaarValidationService;
    GenerateOtpResponse generateOtp(String aadhaarId) throws Exception{
        if(aadhaarValidationService.validateAadhaar(aadhaarId)) {
            throw new Exception("Invalid aadhaar id");
        }

        System.out.println("After aadhaar validation");
        return abdmService.generateOtp(aadhaarId);
    }

        public VerifyOtpResponse verifyOtp(VerifyOtpRequest data) throws Exception {
        return abdmService.verifyOtp(data.getOtp(), data.getTxnId());
    }
}
