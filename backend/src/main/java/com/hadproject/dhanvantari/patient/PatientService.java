package com.hadproject.dhanvantari.patient;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.hadproject.dhanvantari.abdm.ABDMService;
import com.hadproject.dhanvantari.abdm.AadhaarValidationService;
import io.jsonwebtoken.io.IOException;
import lombok.RequiredArgsConstructor;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final ABDMService abdmService;
    private final AadhaarValidationService aadhaarValidationService;
    private final PatientRepository patientRepository;
    GenerateOtpResponse generateOtp(String aadhaarId) throws Exception{
        if(aadhaarValidationService.validateAadhaar(aadhaarId)) {
            throw new Exception("Invalid aadhaar id");
        }

        System.out.println("After aadhaar validation");
        return abdmService.generateOtp(aadhaarId);
    }

    public VerifyOtpResponse verifyOtp(VerifyOtpRequest data) throws Exception, JsonProcessingException {
        return abdmService.verifyOtp(data.getOtp(), data.getTxnId());
    }

    public CheckAndGenerateMobileOtpResponse CheckAndGenerateMobileOtp(CheckAndGenerateMobileOtpRequest data) throws Exception, JsonProcessingException {
        return abdmService.checkAndGenerateMobileOTP(data);
    }

    public CreateHealthIdByAadhaarResponse createHealthIdByAadhaar(CreateHealthIdByAadhaarRequest data) throws Exception, JsonProcessingException {
        return abdmService.createHealthIdByAadhaar(data);
    }

    public byte[] getCard(String token, String authorizationHeader) throws RestClientException, IOException, Exception {

        return abdmService.getCard(token);
    }

    public JSONObject prepareOnConfirmOTPResponse(String response) {

        JSONObject obj = new JSONObject(response);
        if (!obj.isNull("error")) {
            JSONObject errorObj = new JSONObject();
            errorObj.put("status", HttpStatus.BAD_REQUEST);
            errorObj.put("message", obj.getJSONObject("error").getString("message"));
            return errorObj;
        }

        JSONObject auth = obj.getJSONObject("auth");
        JSONObject respond = new JSONObject();

        JSONObject patientObj =  auth.getJSONObject("patient");
        JSONArray identifiersObj = patientObj.getJSONArray("identifiers");
        patientObj.put("mobile", "");
        patientObj.put("abhaNumber", "");
        if (!patientObj.isNull("identifiers")) {
            for (Object identifier : identifiersObj) {
                JSONObject temp = (JSONObject) identifier;
                if (!temp.isNull("value") && temp.getString("type").equals("MOBILE")) patientObj.put("mobile", temp.getString("value"));
                if (!temp.isNull("value") && temp.getString("type").equals("HEALTH_NUMBER")) patientObj.put("abhaNumber", temp.getString("value"));
            }
        }

//        Patient newPatient = patientRepository.findPatientByUser_HealthId(patientObj.getString("id"));
//        newPatient = (newPatient != null) ? newPatient : patientRepository.save(createNewPatient(patientObj));
//        respond.put("patient", newPatient.getPatientJSONObject());
        respond.put("accessToken", auth.getString("accessToken"));

        JSONObject finalObj = new JSONObject();
        finalObj.put("status", HttpStatus.ACCEPTED);
        finalObj.put("message", "Data fetched successfully");
        finalObj.put("data", respond);


        return finalObj;
    }
}
