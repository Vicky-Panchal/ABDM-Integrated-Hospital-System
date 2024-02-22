package com.hadproject.dhanvantari.user;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.hadproject.dhanvantari.doctor.Doctor;
import com.hadproject.dhanvantari.patient.Patient;
import com.hadproject.dhanvantari.token.Token;
import jakarta.persistence.*;

import java.util.Collection;
import java.util.Date;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user")
public class User implements UserDetails {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Integer userId;

  private String firstname;
  private String lastname;
  private String email;
  private String password;
  private String gender;
  private Date dob;
  private String mobile;

  @Column(unique = true, nullable = true)
  public String healthId;
  @Column(nullable = true)
  public String healthIdNumber;

  @Enumerated(EnumType.STRING)
  private Role role;

  @OneToMany(mappedBy = "user")
  private List<Token> tokens;

  @OneToOne(mappedBy = "user")
  @JsonBackReference(value = "patientBackRef")
  public Patient patient;

  @OneToOne(mappedBy = "user")
  @JsonBackReference(value = "doctorBackRef")
  public Doctor doctor;


  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return role.getAuthorities();
  }

  @Override
  public String getPassword() {
    return password;
  }

  @Override
  public String getUsername() {
    return email;
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return true;
  }
}
