package com.hadproject.dhanvantari.appointment;

import com.hadproject.dhanvantari.appointment.dto.*;
import com.hadproject.dhanvantari.aws.S3Service;
import com.hadproject.dhanvantari.doctor.Doctor;
import com.hadproject.dhanvantari.doctor.DoctorRepository;
import com.hadproject.dhanvantari.error_handling.NotFoundException;
import com.hadproject.dhanvantari.patient.Patient;
import com.hadproject.dhanvantari.patient.PatientRepository;
import com.hadproject.dhanvantari.user.Role;
import com.hadproject.dhanvantari.user.User;
import com.hadproject.dhanvantari.user.UserRepository;
import com.hadproject.dhanvantari.user.UserService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import static com.hadproject.dhanvantari.appointment.AppointmentStatus.AVAILABLE;

@Service
@RequiredArgsConstructor
public class AppointmentService {
    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    Logger logger = LoggerFactory.getLogger(AppointmentService.class);
    private final AppointmentRepository appointmentRepository;
    private final UserService userService;
    private final AppointmentSlotRepository appointmentSlotRepository;
    private final DoctorRepository doctorRepository;
    private final S3Service s3Service;


    public void addAppointmentSlots(AddAppointmentSlotRequest data, Principal connectedUser) {
        List<LocalDate> dates = data.getDate();
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        Doctor doctor = doctorRepository.findDoctorByUser(user).orElseThrow(() -> new NotFoundException("Doctor Not Found"));
        for (LocalDate date : dates) {
            addSlots(doctor, date, data.getStartTime(), data.getEndTime());
        }
    }


    public void addSlots(Doctor doctor, LocalDate date, LocalTime startTime, LocalTime endTime) {

        List<AppointmentSlot> existingSlots = appointmentSlotRepository.findByDoctorAndDate(doctor, date);

        if(!existingSlots.isEmpty()){
            throw new RuntimeException("Slot Already Exists");
        }

        // Create appointment slots
        List<AppointmentSlot> slots = new ArrayList<>();
        while (startTime.isBefore(endTime)) {
            AppointmentSlot slot = new AppointmentSlot();
            slot.setDoctor(doctor);
            slot.setDate(date);
            slot.setStartTime(startTime);
            slot.setEndTime(startTime.plusMinutes(30)); // Assuming each slot is 30 minutes
            slot.setAvailabilityStatus(AVAILABLE);
            // Set other relevant fields
            slots.add(slot);
            startTime = startTime.plusMinutes(30); // Move to next slot
        }

        appointmentSlotRepository.saveAll(slots);
    }

    public List<GetAppointmentSlotsResponse> getSlotsByDoctorId(Long userId, LocalDate date) {
        User user = userRepository.findById(userId).orElseThrow(() -> new NotFoundException("User Not Found"));
        Doctor doctor = doctorRepository.findDoctorByUser(user).orElseThrow(() -> new NotFoundException("Doctor Not Found"));

        List<AppointmentSlot> slots = appointmentSlotRepository.findByDoctorAndDate(doctor, date);

        if(slots == null){
            throw new NotFoundException("Slot Not Found");
        }

        List<GetAppointmentSlotsResponse> response = new ArrayList<>();
        String profileUrl = "";
        if(user.getRole().equals(Role.PATIENT) && slots.get(0).getDoctor().getUser().getProfile() != null) {
            profileUrl = s3Service.generatePresignedUrl(slots.get(0).getDoctor().getUser().getProfile());
        }
        for(AppointmentSlot slot : slots) {
            GetAppointmentSlotsResponse responseDto = new GetAppointmentSlotsResponse();
            responseDto.setId(slot.getId());
            responseDto.setDoctorId(doctor.getDoctorId());
            responseDto.setDate(slot.getDate());
            responseDto.setStartTime(slot.getStartTime());
            responseDto.setEndTime(slot.getEndTime());
            responseDto.setAvailabilityStatus(slot.getAvailabilityStatus());
            responseDto.setProfileUrl(profileUrl);
            if(user.getRole().equals(Role.DOCTOR)
                    && (slot.getAvailabilityStatus().equals(AppointmentStatus.SCHEDULED)
                    || slot.getAvailabilityStatus().equals(AppointmentStatus.CANCELLED)
                    || slot.getAvailabilityStatus().equals(AppointmentStatus.COMPLETED))) {
                Appointment appointment = appointmentRepository.findBySlotId(slot.getId());
                if(appointment.getPatient().getUser().getProfile() != null) {
                    profileUrl = s3Service.generatePresignedUrl(appointment.getPatient().getUser().getProfile());
                }
                responseDto.setPurpose(appointment.getPurpose());
                responseDto.setPatientName(appointment.getPatient().getUser().getFirstname() + " " + appointment.getPatient().getUser().getLastname());
                responseDto.setProfileUrl(profileUrl);
            }
            response.add(responseDto);
        }
        return response;
    }

    public void bookAppointment(BookAppointmentRequest data, Principal connectedUser) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        Patient patient = patientRepository.findPatientByUser(user).orElseThrow(() -> new NotFoundException("Patient Not Found"));

        AppointmentSlot slot = appointmentSlotRepository.findById(data.getSlotId()).orElseThrow(() -> new NotFoundException("Slot Not Found"));

        if(slot.getAvailabilityStatus() != AVAILABLE){
            throw new RuntimeException("Slot Not Available");
        }

        slot.setAvailabilityStatus(AppointmentStatus.SCHEDULED);
        appointmentSlotRepository.save(slot);

        appointmentRepository.save(
                Appointment.builder()
                        .purpose(data.getPurpose())
                        .appointmentDate(slot.getDate())
                        .appointmentTime(slot.getStartTime())
                        .doctor(slot.getDoctor())
                        .patient(patient)
                        .slot(slot)
                        .build()
        );
    }

    public void changeStatus(ChangeStatusRequest data) {
        
    }

    public List<GetPatientAppointmentsResponse> getPatientAppointments(Principal connectedUser) {
        List<GetPatientAppointmentsResponse> response = new ArrayList<>();
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        Patient patient = patientRepository.findPatientByUser(user).orElseThrow(() -> new NotFoundException("Patient Not Found"));

        List<Appointment> appointments = appointmentRepository.findByPatient(patient);


        for(Appointment appointment : appointments) {
            String profileUrl = "";
            if(appointment.getDoctor().getUser().getProfile() != null) {
                profileUrl = s3Service.generatePresignedUrl(appointment.getDoctor().getUser().getProfile());
            }
            GetPatientAppointmentsResponse responseDto = new GetPatientAppointmentsResponse();
            responseDto.setAppointmentId(appointment.getId());
            responseDto.setAppointmentDate(appointment.getAppointmentDate());
            responseDto.setPurpose(appointment.getPurpose());
            responseDto.setAppointmentStartTime(appointment.getAppointmentTime());
            responseDto.setAppointmentEndTime(appointment.getAppointmentTime().plusMinutes(30));
            responseDto.setDoctorName(appointment.getDoctor().getUser().getFirstname() + " " + appointment.getDoctor().getUser().getLastname());
            responseDto.setProfileUrl(profileUrl);
            response.add(
                    GetPatientAppointmentsResponse.builder()
                            .purpose(appointment.getPurpose())
                            .appointmentId(appointment.getId())
                            .slotId(appointment.getSlot().getId())
                            .status(String.valueOf(appointment.getSlot().getAvailabilityStatus()))
                            .appointmentDate(appointment.getAppointmentDate())
                            .appointmentStartTime(appointment.getAppointmentTime())
                            .appointmentEndTime(appointment.getAppointmentTime().plusMinutes(30))
                            .doctorName(appointment.getDoctor().getUser().getFirstname() + " " + appointment.getDoctor().getUser().getLastname())
                            .build()
            );
        }

        return response;
    }

    public int countAppointmentsByDateRange(LocalDate startDate, LocalDate endDate) {
        return appointmentRepository.countAppointmentsByDateRange(startDate, endDate);
    }
}
