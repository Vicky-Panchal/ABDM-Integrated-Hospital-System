package com.hadproject.dhanvantari.visit;

import com.hadproject.dhanvantari.abdm.ABDMService;
import com.hadproject.dhanvantari.care_context.CareContext;
import com.hadproject.dhanvantari.consent.Consent;
import com.hadproject.dhanvantari.consent.ConsentRequest;
import com.hadproject.dhanvantari.consent.ConsentRequestRepository;
import com.hadproject.dhanvantari.doctor.Doctor;
import com.hadproject.dhanvantari.doctor.DoctorRepository;
import com.hadproject.dhanvantari.patient.Patient;
import com.hadproject.dhanvantari.patient.PatientRepository;
import com.hadproject.dhanvantari.user.User;
import com.hadproject.dhanvantari.visit.dto.CreateVisitRequest;
import com.hadproject.dhanvantari.visit.dto.GetVisitByDoctorResponse;
import lombok.RequiredArgsConstructor;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.security.Principal;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static com.hadproject.dhanvantari.abdm.ABDMServiceHelper.prepareHeader;
import static java.util.UUID.randomUUID;

@Service
@RequiredArgsConstructor
public class VisitService {
    Logger logger = LoggerFactory.getLogger(VisitService.class);
    private final VisitRepository visitRepository;
    private final ABDMService abdmService;

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final ConsentRequestRepository consentRequestRepository;

    public Visit createNewVisit(Patient patient, CreateVisitRequest data) {
        logger.info("entering create new visit with data:{}", patient.getPatientJSONObject());

        List<Visit> list = visitRepository.findVisitByPatient(patient);

//        Visit visit = new Visit(LocalDate.now(), "Visit-" + patient.getPatientId() + "-" + (list.size() + 1), "Consultation on : " + LocalDate.now());
        Visit visit = new Visit();
        visit.setVisitDate(LocalDate.now());
        visit.setDiagnosis(data.getDiagnosis());
        visit.setDisplay("Consultation on : " + LocalDate.now());
        visit.setReferenceNumber("Visit-" + patient.getPatientId() + "-" + (list.size() + 1));
        visit.setVisitDate(LocalDate.now());
        visit.setDiagnosis(data.getDiagnosis());
        visit.setDosageInstruction(data.getDosageInstruction());
        visit.setPrescription(data.getPrescription());
        visit.setHealthRecord(data.getHealthRecord().getBytes());
        visit.setPatient(patient);

        logger.info("created a visit with data: {}", visit);

        // Created a visit, saved it to repository,
        // Added that visit to patient and linked patient in that visit
        patient.addVisits(visitRepository.save(visit));
        patientRepository.save(patient);

        logger.info("exiting create new visit with data: {}", visit);

        return visit;
    }

    public String addCareContext(CreateVisitRequest data) throws Exception {
        logger.info("entering add care context with data: {} and patient = {}", data.getPatientAuthToken(), data.getPatientId());
        Patient patient = patientRepository.findPatientByPatientId(Long.parseLong(data.patientId));
        abdmService.setToken();
        String authToken = abdmService.getToken();
        if (authToken.equals("-1")) return null;

        Visit visit = createNewVisit(patient, data);

        // Prepare requestBody to send to ABDM.
        JSONObject request = prepareAddContextRequest(data.getPatientAuthToken(), visit, "" + patient.getPatientId(), patient.getUser().getFirstname());
        visit.setRequestId(request.get("requestId").toString());

        visitRepository.save(visit);

        // Send request to ABDM
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = prepareHeader(authToken);
        HttpEntity<String> entity = new HttpEntity<String>(request.toString(), headers);
        HttpEntity<String> response = restTemplate.exchange("https://dev.abdm.gov.in/gateway/v0.5/links/link/add-contexts", HttpMethod.POST, entity, String.class);

        logger.info("exiting add care context with response = {}", response);
        return request.get("requestId").toString();
    }

    public JSONObject prepareAddContextRequest(String patientAuthToken, Visit visit, String patientId, String patientName) {
        logger.info("Entering prepareAddContextRequest with data: ");
        logger.info("pateintAuthToken: {}", patientAuthToken);
        logger.info("visit: {}", visit);
        logger.info("patientId: {}", patientId);
        logger.info("patientname: {}", patientName);

        JSONObject request = new JSONObject();
        request.put("requestId", randomUUID());
        request.put("timestamp", ZonedDateTime.now( ZoneOffset.UTC ).format( DateTimeFormatter.ISO_INSTANT ));

        JSONObject link = new JSONObject();
        link.put("accessToken", patientAuthToken);

        JSONObject patient = new JSONObject();
        patient.put("referenceNumber", patientId);
        patient.put("display", patientName);

        JSONObject careContext = new JSONObject();
        careContext.put("referenceNumber", visit.getReferenceNumber());
        careContext.put("display", visit.getDisplay());
        link.put("patient", patient);
        patient.put("careContexts", new JSONArray());
        patient.getJSONArray("careContexts").put(careContext);
        request.put("link", link);

        logger.info("Exiting prepareAddContextRequest with data: {}", request);
        return request;
    }

    public String[] createOnAddContextResponse(String res) {
        logger.info("Entering createOnAddContextResponse with data: {}", res);

        JSONObject obj = new JSONObject(res);
        JSONObject response = new JSONObject();
        JSONObject resp = obj.getJSONObject("resp");
        String requestId = resp.get("requestId").toString();

        Visit visit = visitRepository.findVisitByRequestId(requestId);
        if (obj.isNull("error")) {
            response.put("status", HttpStatus.OK);
            response.put("message", "New visit created with id " + visit.getId());
            response.put("data", visit.getJSONObject());
        }
        else {
            response.put("status", HttpStatus.BAD_REQUEST);
            response.put("message", obj.getJSONObject("error").getString("message"));
            visitRepository.delete(visit);
        }
        logger.info("exiting create on add care context response with data{}", response);
        return new String[]{requestId, response.toString()};
    }

    public String getVisitById(String req) {
        logger.info("entered getVisitById with data: {}", req);
        JSONObject obj = new JSONObject(req);
        JSONObject response = new JSONObject();
        Visit visit = visitRepository.findVisitById(obj.getLong("visitId"));

        if (visit == null) {
            JSONObject res = new JSONObject();
            res.put("status", HttpStatus.BAD_REQUEST);
            res.put("message", "Visit with id : " + obj.getString("visitId") + " not found");
            return res.toString();
        }

        if (visit.getDoctor() != null && visit.getDoctor().getDoctorId() != Long.parseLong(obj.getString("doctorId"))) {
            JSONObject res = new JSONObject();
            res.put("status", HttpStatus.BAD_REQUEST);
            res.put("message", "Not authorized to view this visit");
            return res.toString();
        }

        Patient patient = visit.getPatient();
        Doctor doctor = doctorRepository.findByDoctorId(obj.getLong("doctorId")).orElseThrow(() -> new RuntimeException("Doctor Not Found"));
        response.put("visit", visit.getJSONObject());
        response.put("patient", patient.getPatientJSONObject());
        response.put("otherVisit", prepareOldVisit(patient, doctor));
        response.put("consentRequests", prepareConsentRequest(visit));
        logger.info("exiting getVisitById with data: {}", response);

        JSONObject object = new JSONObject();
        object.put("status", HttpStatus.OK);
        object.put("message", "Visit Fetched Successfully");
        object.put("data", response);


        return object.toString();
    }

    public JSONArray prepareOldVisit(Patient patient, Doctor doctor) {
        JSONArray arr = new JSONArray();
        List<Visit> listOfVisits = visitRepository.findVisitByDoctorAndPatient(doctor, patient);
        for (Visit visit : listOfVisits) {
            arr.put(visit.getJSONObject());
        }
        return arr;
    }

    public JSONObject prepareConsentRequest(Visit visit) {
        JSONObject mainObj = new JSONObject();
        mainObj.put("consentRequest", new JSONArray());
        List<ConsentRequest> consentRequestList = visit.getConsentRequestList();
        for (ConsentRequest consentRequest : consentRequestList) {
            JSONObject consentRequestObj = new JSONObject();

            consentRequestObj.put("id", consentRequest.getRequestId());
            consentRequestObj.put("status", consentRequest.getStatus());
            consentRequestObj.put("consent", new JSONArray());
            if (!consentRequest.getStatus().equals("REQUESTED")) {
                List<Consent> consentList = consentRequest.getConsentList();
                for (Consent consent : consentList) {
                    JSONObject consentObj = new JSONObject();
                    consentObj.put("id", consent.getConsentId());
                    consentObj.put("status", consent.getStatus());
                    if (!consent.getStatus().equals("DELIVERED")) {
                        consentObj.put("careContext", new JSONArray());
                        consentRequestObj.getJSONArray("consent").put(consentObj);
                        continue;
                    }
                    consentObj.put("careContext", new JSONArray());
                    List<CareContext> careContextList = consent.getCareContextList();

                    for (int k = 0; k < careContextList.size(); k++) {
                        JSONObject careContextObj = getJsonObject(careContextList, k);
                        consentObj.getJSONArray("careContext").put(careContextObj);
                    }
                    consentRequestObj.getJSONArray("consent").put(consentObj);
                }
            }
            mainObj.getJSONArray("consentRequest").put(consentRequestObj);
        }
        return mainObj;
    }

    private static JSONObject getJsonObject(List<CareContext> careContextList, int k) {
        CareContext careContext = careContextList.get(k);
        JSONObject careContextObj = new JSONObject();
        careContextObj.put("patientReference", careContext.getPatientReference());
        careContextObj.put("prescription", careContext.getPrescription());
        careContextObj.put("diagnosis", careContext.getDiagnosis());
        careContextObj.put("dosageInstruction", careContext.getDosageInstruction());
        careContextObj.put("doctorName", careContext.getDoctorName());
        careContextObj.put("doctorId", careContext.getDoctorId());
        careContextObj.put("careContextReference", careContext.getCareContextReference());
        return careContextObj;
    }

    public List<GetVisitByDoctorResponse> getVisitByDoctor(Principal connectedUser) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        Doctor doctor = doctorRepository.findDoctorByUser(user).orElseThrow(() -> new RuntimeException("Doctor Not Found"));

        List<ConsentRequest> consentRequests = consentRequestRepository.findConsentRequestByDoctor(doctor);
        List<Visit> visits = new ArrayList<>();

        for (ConsentRequest consentRequest : consentRequests) {
            if (consentRequest.getStatus() != null && consentRequest.getStatus().equals("GRANTED") && consentRequest.getDataEraseAt().compareTo(String.valueOf(new Date())) <= 0) {
                visits.add(
                        consentRequest.getVisit()
                );
            }
        }

        List<GetVisitByDoctorResponse> responseList = new ArrayList<>();

        for (Visit visit : visits) {
            responseList.add(
                    GetVisitByDoctorResponse.builder()
                            .visitId(String.valueOf(visit.getId()))
                            .visitDate(visit.getVisitDate())
                            .diagnosis(visit.getDiagnosis())
                            .display(visit.getDisplay())
                            .dosageInstruction(visit.getDosageInstruction())
                            .healthRecord(Arrays.toString(visit.getHealthRecord()))
                            .prescription(visit.getPrescription())
                            .patientId(String.valueOf(visit.getPatient().getPatientId()))
                            .build()
            );
        }

        return responseList;
    }
}
