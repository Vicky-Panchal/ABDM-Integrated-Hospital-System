package com.hadproject.dhanvantari.doctor;

import com.hadproject.dhanvantari.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Doctor findDoctorByDoctorId(Long doctorId);
    Doctor findDoctorByUser(User user);
}
