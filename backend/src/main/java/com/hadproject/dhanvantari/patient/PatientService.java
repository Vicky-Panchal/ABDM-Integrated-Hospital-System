package com.hadproject.dhanvantari.patient;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.hadproject.dhanvantari.abdm.ABDMService;
import com.hadproject.dhanvantari.abdm.AadhaarValidationService;
import com.hadproject.dhanvantari.aws.S3Service;
import com.hadproject.dhanvantari.patient.dto.*;
import com.hadproject.dhanvantari.user.Role;
import com.hadproject.dhanvantari.user.User;
import com.hadproject.dhanvantari.user.UserRepository;
import io.jsonwebtoken.io.IOException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final ABDMService abdmService;
    private final AadhaarValidationService aadhaarValidationService;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final S3Service s3Service;

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

//    public PatientDto createPatient(PatientCreateRequest request) {
//        // Map the request to Patient entity
//        Patient patient = mapRequestToEntity(request);
//
//        // Save the patient entity
//        Patient savedPatient = patientRepository.save(patient);
//
//        // Map the saved patient entity to DTO and return
//        return mapEntityToDto(savedPatient);
//    }

//    public PatientDto getPatientById(Long id) {
//        // Find the patient by id
//        Patient patient = patientRepository.findById(id)
//                .orElseThrow(() -> new EntityNotFoundException("Patient not found"));
//
//        // Map the patient entity to DTO and return
//        return mapEntityToDto(patient);
//    }
//
//    private Patient mapRequestToEntity(PatientCreateRequest request) {
//        return Patient.builder()
//                .firstName(request.getFirstName())
//                .lastName(request.getLastName())
//                .mobile(request.getMobile())
//                .gender(request.getGender())
//                .dob(request.getDob())
//                .email(request.getEmail())
//                .profile(request.getProfile())
//                .build();
//    }
//
//    private PatientDto mapEntityToDto(Patient patient) {
//        return PatientDto.builder()
//                .id(patient.getId())
//                .firstName(patient.getFirstName())
//                .lastName(patient.getLastName())
//                .mobile(patient.getMobile())
//                .gender(patient.getGender())
//                .dob(patient.getDob())
//                .email(patient.getEmail())
//                .profile(patient.getProfile())
//                .build();
//    }

    public List<GetAllPatient> getAllPatients() {
        List<User> users = userRepository.findByRole(Role.PATIENT);

        List<GetAllPatient> patients = new ArrayList<>();
        for (User user : users) {
            Patient patient = patientRepository.findPatientByUser(user).orElseThrow(() -> new EntityNotFoundException("Patient not found"));
            String profileUrl = "";
            if(user.getProfile() != null) {
                profileUrl = s3Service.generatePresignedUrl(user.getProfile());
            }
            patients.add(GetAllPatient.builder()
                            .patientId(String.valueOf(patient.getPatientId()))
                            .dob(user.getDob())
                            .email(user.getEmail())
                            .firstName(user.getFirstname())
                            .middleName(user.getMiddlename())
                            .lastName(user.getLastname())
                            .profile(profileUrl)
                            .gender(user.getGender())
                    .build());
        }

        return patients;
    }
}
