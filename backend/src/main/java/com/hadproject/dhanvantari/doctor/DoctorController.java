package com.hadproject.dhanvantari.doctor;

import com.hadproject.dhanvantari.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;


import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/doctor")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorRepository doctorRepository;
    private final DoctorService doctorService;

    @GetMapping("/searchDoctor")
    public List<DoctorDTO> autocompleteDoctors(@RequestParam("name") String name) {
        return doctorService.searchDoctor(name);
    }

    @GetMapping("/getAllDoctors")
    public ResponseEntity<List<GetAllDoctor>> getAllDoctors () {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }
}
