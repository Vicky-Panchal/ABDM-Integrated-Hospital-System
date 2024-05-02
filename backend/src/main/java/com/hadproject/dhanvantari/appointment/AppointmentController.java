package com.hadproject.dhanvantari.appointment;

import com.hadproject.dhanvantari.appointment.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1/appointment")
@RequiredArgsConstructor
public class AppointmentController {
    private final AppointmentService appointmentService;


    @PostMapping("/addSlots")
    @PreAuthorize("hasRole('DOCTOR')")
    public String addSlot(@RequestBody() AddAppointmentSlotRequest slots, Principal connectedUser) {
        appointmentService.addAppointmentSlots(slots, connectedUser);
        return "Slots added successfully";
    }

    @GetMapping("/getSlotsByDoctorId")
    public List<GetAppointmentSlotsResponse> getSlotsByDoctorId(@RequestParam("userId") Long userId, @RequestParam("date") LocalDate date) {
        return appointmentService.getSlotsByDoctorId(userId, date);
    }

    @PostMapping("/bookAppointment")
    @PreAuthorize("hasRole('PATIENT')")
    public String bookAppointment(@RequestBody() BookAppointmentRequest data, Principal connectedUser) {
        appointmentService.bookAppointment(data, connectedUser);
        return "Appointment booked successfully";
    }

    @PostMapping("/changeStatus")
    public String changeStatus(ChangeStatusRequest data) {
        appointmentService.changeStatus(data);
        return "Status changed successfully";
    }

    @GetMapping("/getPatientAppointments")
    @PreAuthorize("hasRole('PATIENT')")
    public List<GetPatientAppointmentsResponse> getPatientAppointments(Principal connectedUser) {
        return appointmentService.getPatientAppointments(connectedUser);
    }
//    @GetMapping("/appointmentsCount")
//public ResponseEntity<List<Integer>> getAppointmentsCount(@RequestParam("range") String range) {
//    LocalDate startDate, endDate;
//
//    switch (range) {
//        case "week":
//            endDate = LocalDate.now();
//            startDate = endDate.minusDays(6); // Last 7 days
//            break;
//        case "month":
//            endDate = LocalDate.now();
//            startDate = endDate.minusDays(29); // Last 30 days including today
//            break;
//        case "year":
//            endDate = LocalDate.now();
//            startDate = endDate.minusYears(1).plusDays(1); // Last 12 months starting from the first day of the current month 12 months ago
//            break;
//        default:
//            // Handle invalid range parameter
//            return ResponseEntity.badRequest().body(null);
//    }
//
//    List<Integer> appointmentsCountList = new ArrayList<>();
//    LocalDate currentDate = startDate;
//    while (!currentDate.isAfter(endDate)) {
//        int count = appointmentService.countAppointmentsByDateRange(currentDate, currentDate.plusDays(1));
//        appointmentsCountList.add(count);
//        currentDate = currentDate.plusDays(1);
//    }
//
//    return ResponseEntity.ok(appointmentsCountList);
//}

//@GetMapping("/appointmentsCount")
//public ResponseEntity<List<Integer>> getAppointmentsCount(@RequestParam("range") String range) {
//    LocalDate startDate, endDate;
//
//    switch (range) {
//        case "week":
//            endDate = LocalDate.now();
//            startDate = endDate.minusDays(6); // Last 7 days
//            break;
//        case "month":
//            endDate = LocalDate.now();
//            startDate = endDate.minusDays(29); // Last 30 days including today
//            break;
//        case "year":
//            endDate = LocalDate.now();
//            startDate = endDate.minusYears(1).plusDays(1); // Last 12 months starting from the first day of the current month 12 months ago
//            break;
//        default:
//            // Handle invalid range parameter
//            return ResponseEntity.badRequest().body(null);
//    }
//
//    List<Integer> appointmentsCountList = new ArrayList<>();
//    LocalDate currentDate = startDate;
//    while (!currentDate.isAfter(endDate)) {
//        int count = appointmentService.countAppointmentsByDateRange(currentDate, currentDate.plusDays(1));
//        appointmentsCountList.add(count);
//        currentDate = currentDate.plusDays(1);
//    }
//
//    return ResponseEntity.ok(appointmentsCountList);
//}
@GetMapping("/appointmentsCount")
public ResponseEntity<List<Integer>> getAppointmentsCount(@RequestParam("range") String range) {
    List<Integer> appointmentsCountList = new ArrayList<>();

    switch (range) {
        case "week":
            // Calculate last 7 days appointments count
            LocalDate weekEndDate = LocalDate.now();
            LocalDate weekStartDate = weekEndDate.minusDays(6);
            for (LocalDate date = weekStartDate; !date.isAfter(weekEndDate); date = date.plusDays(1)) {
                int appointmentsCount = appointmentService.countAppointmentsByDateRange(date,date.plusDays(1));
                appointmentsCountList.add(appointmentsCount);
            }
            break;

        case "month":
            // Calculate last 30 days appointments count
            LocalDate monthEndDate = LocalDate.now();
            LocalDate monthStartDate = monthEndDate.minusDays(29);
            for (LocalDate date = monthStartDate; !date.isAfter(monthEndDate); date = date.plusDays(1)) {
                int appointmentsCount = appointmentService.countAppointmentsByDateRange(date,date.plusDays(1));
                appointmentsCountList.add(appointmentsCount);
            }
            break;

        case "year":
            // Calculate average appointments count per month for the last 12 months
            LocalDate endDate = LocalDate.now();
            LocalDate startDate = endDate.minusYears(1).plusDays(1); // Last 12 months starting from the first day of the current month 12 months ago

            // Iterate over the last 12 months
            for (int i = 0; i < 12; i++) {
                LocalDate firstDayOfMonth = endDate.minusMonths(i).withDayOfMonth(1);
                LocalDate lastDayOfMonth = firstDayOfMonth.plusMonths(1).minusDays(1);
                int appointmentsCount = appointmentService.countAppointmentsByDateRange(firstDayOfMonth, lastDayOfMonth);
                appointmentsCountList.add(appointmentsCount);
            }
            break;

        default:
            // Handle invalid range parameter
            return ResponseEntity.badRequest().body(null);
    }

    return ResponseEntity.ok(appointmentsCountList);
}


}
