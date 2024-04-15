package com.hadproject.dhanvantari.visit;

import com.hadproject.dhanvantari.patient.Patient;
import com.hadproject.dhanvantari.patient.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.HashMap;


@RestController
@RequestMapping("/api/v1/visit")
@RequiredArgsConstructor
public class VisitController {
    Logger logger = LoggerFactory.getLogger(VisitController.class);
    private final VisitService visitService;
    private final PatientRepository patientRepository;

    private static final HashMap<String, SseEmitter> map = new HashMap<>();

    @GetMapping("/add-visit")
    @CrossOrigin
    public SseEmitter addNewVisit(@RequestParam("patientId") String patient_id, @RequestParam("accessToken") String patientAuthToken) throws Exception {
        logger.info("Entering addNewVisitClass with data: patientId - {} authToken: {}", patient_id, patientAuthToken);
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);

        Patient patient = patientRepository.findPatientByPatientId(Long.parseLong(patient_id));
        String requestId = visitService.addCareContext(patient, patientAuthToken);

        if (requestId == null)    throw new RuntimeException("unable to send request");

        try {
            emitter.send(SseEmitter.event().name("add-visit"));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        map.put(requestId, emitter);
        return emitter;
    }
}
