package com.hadproject.dhanvantari.doctor;

import com.hadproject.dhanvantari.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorService {

    private DoctorRepository doctorRepository;

    public List<DoctorDTO> searchDoctor(String name) {
        List<Doctor> doctors =  doctorRepository.findByUserFirstnameContainingIgnoreCaseOrUserLastnameContainingIgnoreCase(name, name);
        
        List<DoctorDTO> response = new ArrayList<>();
        for(Doctor doctor : doctors){
            DoctorDTO responseDto = getDoctorDTO(doctor);
            response.add(responseDto);
        }
        
        return response;
    }

    private static DoctorDTO getDoctorDTO(Doctor doctor) {
        DoctorDTO responseDto = new DoctorDTO();
        responseDto.setDoctorId(doctor.getDoctorId());
        responseDto.setUserId(doctor.getUser().getUserId());
        responseDto.setEmail(doctor.getUser().getEmail());
        responseDto.setFirstName(doctor.getUser().getFirstname());
        responseDto.setLastName(doctor.getUser().getLastname());
        responseDto.setHospitalName(doctor.getHospitalName());
        responseDto.setSpecialization(doctor.getSpecialization());
        return responseDto;
    }
}
