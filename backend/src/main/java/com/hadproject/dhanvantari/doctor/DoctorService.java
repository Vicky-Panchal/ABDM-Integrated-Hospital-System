package com.hadproject.dhanvantari.doctor;

import com.hadproject.dhanvantari.aws.S3Service;
import com.hadproject.dhanvantari.user.Role;
import com.hadproject.dhanvantari.user.User;
import com.hadproject.dhanvantari.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorService {
    private final UserRepository userRepository;
    private final S3Service s3Service;
    private final DoctorRepository doctorRepository;

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

  public List<GetAllDoctor> getAllDoctors(){
      List<User> users = userRepository.findByRole(Role.DOCTOR);

      List<GetAllDoctor> doctors = new ArrayList<>();
      for (User user : users) {
          Doctor doctor = doctorRepository.findDoctorByUser(user).orElseThrow(() -> new EntityNotFoundException("Doctor Not Found"));
          String profileUrl = "";
          if (user.getProfile() != null)
          {
            profileUrl = s3Service.generatePresignedUrl(user.getProfile());
          }
          doctors.add(GetAllDoctor.builder()
                  .doctorId(String.valueOf(doctor.getDoctorId()))
                  .email(user.getEmail())
                  .firstName(user.getFirstname())
                  .middleName(user.getMiddlename())
                  .lastName(user.getLastname())
                  .gender(user.getGender())
                  .specialization(doctor.getSpecialization())
                  .dob(user.getDob())
                  .hospitalName(doctor.getHospitalName())
                  .profile(profileUrl)
                  .qualification(doctor.getQualifications())
                  .build());
      }
      return doctors;
  }

}
