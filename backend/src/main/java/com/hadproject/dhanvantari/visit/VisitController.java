package com.hadproject.dhanvantari.visit;

import com.hadproject.dhanvantari.patient.PatientRepository;
import com.hadproject.dhanvantari.visit.dto.CreateVisitRequest;
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

    @PostMapping("/add-visit")
    public SseEmitter addNewVisit(@RequestBody CreateVisitRequest data) throws Exception {
        logger.info("Entering addNewVisitClass with data: patientId - {} authToken: {}", data.getPatientId(), data.getPatientAuthToken());
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);

//        Patient patient = patientRepository.findPatientByPatientId(Long.parseLong(data.patientId));
        String requestId = visitService.addCareContext(data);

        if (requestId == null)    throw new RuntimeException("unable to send request");

        try {
            emitter.send(SseEmitter.event().name("add-visit"));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        map.put(requestId, emitter);
        return emitter;
    }

    @PostMapping("/v0.5/links/link/on-add-contexts")
    public void onAddNewVisit(@RequestBody String response) {
        logger.info("Entering addNewVisit with data: {}", response);
        String[] respond = visitService.createOnAddContextResponse(response);
        SseEmitter emitter = map.get(respond[0]);

        try {
            emitter.send(SseEmitter.event().name("on-init").data(respond[1]));
            emitter.complete();
            map.remove(respond[0]);
        }
        catch (Exception e) {
            logger.error("error occurred: {}", e);
            emitter.complete();
            map.remove(respond[0]);
        }
    }

    @GetMapping(value = "/visit", produces = "Application/JSON")
    public String getVisit(@RequestBody String req) {
        return visitService.getVisitById(req);
    }
}
