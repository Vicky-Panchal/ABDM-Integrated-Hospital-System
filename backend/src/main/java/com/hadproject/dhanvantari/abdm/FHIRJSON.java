package com.hadproject.dhanvantari.abdm;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static java.util.UUID.randomUUID;

public class FHIRJSON {
    static Logger logger = LoggerFactory.getLogger(FHIRJSON.class);

    public static String prepareFHIRJSONString(String doctorId, String patientName, String doctorName, String dosageInstructions, String patientId, String diagnosis, String medicineName)  {
        logger.info("entering prepareFHIRJSONString with data");
        logger.info(" {} {} {} {} {} {} {}", doctorId, patientName, doctorName, dosageInstructions, patientId, diagnosis, medicineName);
        return fillFHIRJSON(doctorId,patientName,doctorName,dosageInstructions,patientId,diagnosis,medicineName);
    }

    private static String fillFHIRJSON(String doctorId, String patientName, String doctorName, String dosageInstructions, String patientId, String diagnosis, String medicineName) {
        return "{\"resourceType\":\"Bundle\",\"id\":\""+randomUUID()+"\",\"meta\":{\"lastUpdated\":\"2018-08-01T00:00:00.000+05:30\"},\"identifier\":{\"system\":\"https://www.max.in/bundle\",\"value\":\""+randomUUID()+"\"},\"type\":\"document\",\"timestamp\":\"2018-08-01T00:00:00.000+05:30\",\"entry\":[{\"fullUrl\":\"Composition/"+randomUUID()+"\",\"resource\":{\"resourceType\":\"Composition\",\"id\":\""+randomUUID()+"\",\"identifier\":{\"system\":\"https://www.max.in/document\",\"value\":\""+randomUUID()+"\"},\"status\":\"final\",\"type\":{\"coding\":[{\"system\":\"https://projecteka.in/sct\",\"code\":\"440545006\",\"display\":\"Prescription record\"}]},\"subject\":{\"reference\":\"Patient/" + patientId +"\"},\"date\":\"2018-08-01T00:00:00.605+05:30\",\"author\":[{\"reference\":\"Practitioner/"+ doctorId + "\",\"display\":\"" + doctorName + "\"}],\"title\":\"Prescription\",\"section\":[{\"title\":\"OPD Prescription\",\"code\":{\"coding\":[{\"system\":\"https://projecteka.in/sct\",\"code\":\"440545006\",\"display\":\"Prescription record\"}]},\"entry\":[{\"reference\":\"MedicationRequest/"+randomUUID()+"\"}]}]}},{\"fullUrl\":\"Practitioner/"+doctorId+"\",\"resource\":{\"resourceType\":\"Practitioner\",\"id\":\""+doctorId+"\",\"identifier\":[{\"system\":\"https://www.mciindia.in/doctor\",\"value\":\""+doctorId+"\"}],\"name\":[{\"text\":\""+doctorName+"\",\"prefix\":[\"Dr\"],\"suffix\":[\"\"]}]}},{\"fullurl\":\"Patient/"+patientId+"\",\"resource\":{\"resourceType\":\"Patient\",\"id\":\""+patientId+"\",\"name\":[{\"text\":\""+patientName+"\"}],\"gender\":\"male\"}},{\"fullUrl\":\"Condition/"+randomUUID()+"\",\"resource\":{\"resourceType\":\"Condition\",\"id\":\""+randomUUID()+"\",\"code\":{\"text\":\""+diagnosis+"\"},\"subject\":{\"reference\":\"Patient/"+patientId+"\"}}},{\"fullUrl\":\"Medication/"+randomUUID()+"\",\"resource\":{\"resourceType\":\"Medication\",\"id\":\""+randomUUID()+"\",\"code\":{\"text\":\""+medicineName+"\"}}},{\"fullUrl\":\"MedicationRequest/"+randomUUID()+"\",\"resource\":{\"resourceType\":\"MedicationRequest\",\"id\":\""+randomUUID()+"\",\"status\":\"active\",\"intent\":\"order\",\"medicationReference\":{\"reference\":\"Medication/"+randomUUID()+"\"},\"subject\":{\"reference\":\"Patient/"+patientId+"\"},\"authoredOn\":\"2018-08-01T00:00:00+05:30\",\"requester\":{\"reference\":\"Practitioner/"+doctorId+"\"},\"reasonReference\":[{\"reference\":\"Condition/"+randomUUID() +"\"}],\"dosageInstruction\":[{\"text\":\""+dosageInstructions+"\"}]}}]}";
    }
}
