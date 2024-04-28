package com.hadproject.dhanvantari.visit;

import com.hadproject.dhanvantari.abdm.ABDMService;
import com.hadproject.dhanvantari.patient.Patient;
import com.hadproject.dhanvantari.patient.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import static com.hadproject.dhanvantari.abdm.ABDMServiceHelper.prepareHeader;
import static java.util.UUID.randomUUID;

@Service
@RequiredArgsConstructor
public class VisitService {
    Logger logger = LoggerFactory.getLogger(VisitService.class);
    VisitRepository visitRepository;
    ABDMService abdmService;

    PatientRepository patientRepository;

    public Visit createNewVisit(Patient patient) {
        logger.info("entering create new visit with data:{}", patient.getPatientJSONObject());

        List<Visit> list = visitRepository.findVisitByPatient(patient);

        Visit visit = new Visit(LocalDate.now(), "Visit-" + patient.getPatientId() + "-" + (list.size() + 1), "Consultation on : " + LocalDate.now());
        visit.setPatient(patient);

        logger.info("created a visit with data: {}", visit);

        // Created a visit, saved it to repository,
        // Added that visit to patient and linked patient in that visit
        patient.addVisits(visitRepository.save(visit));
        patientRepository.save(patient);

        logger.info("exiting create new visit with data: {}", visit);

        return visit;
    }

    public String addCareContext(Patient patient, String patientAuthToken) throws Exception {
        logger.info("entering add care context with data: {} and patient = {}", patientAuthToken, patient);

        abdmService.setToken();
        String authToken = abdmService.getToken();
        if (authToken.equals("-1")) return null;

        Visit visit = createNewVisit(patient);

        // Prepare requestBody to send to ABDM.
        JSONObject request = prepareAddContextRequest(patientAuthToken, visit, "" + patient.getPatientId(), patient.getUser().getFirstname());
        visit.setRequestId(request.get("requestId").toString());
        visit.setVisitDate(LocalDate.now());
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
}
