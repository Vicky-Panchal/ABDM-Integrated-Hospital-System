package com.hadproject.dhanvantari.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hadproject.dhanvantari.auth.dto.AuthenticationRequest;
import com.hadproject.dhanvantari.auth.dto.AuthenticationResponse;
import com.hadproject.dhanvantari.auth.dto.RegisterRequest;
import com.hadproject.dhanvantari.config.JwtService;
import com.hadproject.dhanvantari.doctor.Doctor;
import com.hadproject.dhanvantari.doctor.DoctorRepository;
import com.hadproject.dhanvantari.patient.Patient;
import com.hadproject.dhanvantari.patient.PatientRepository;
import com.hadproject.dhanvantari.token.Token;
import com.hadproject.dhanvantari.token.TokenRepository;
import com.hadproject.dhanvantari.token.TokenType;
import com.hadproject.dhanvantari.user.Role;
import com.hadproject.dhanvantari.user.User;
import com.hadproject.dhanvantari.user.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
  private final UserRepository repository;
  private final TokenRepository tokenRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final AuthenticationManager authenticationManager;
  private final PatientRepository patientRepository;
  private final DoctorRepository doctorRepository;

  public AuthenticationResponse register(RegisterRequest request) {
    var user = User.builder()
        .firstname(request.getFirstname())
            .middlename(request.getMiddlename())
        .lastname(request.getLastname())
        .email(request.getEmail())
        .gender(request.getGender())
        .password(passwordEncoder.encode(request.getPassword()))
        .role(request.getRole())
            .dob(request.getDob())
            .mobile(request.getMobile())
        .build();
    var savedUser = repository.save(user);
    if(request.getRole().equals(Role.PATIENT)) {
        patientRepository.save(Patient.builder()
                        .user(user)
                .build());
    }
    if(request.getRole().equals(Role.DOCTOR)) {
      doctorRepository.save(Doctor.builder()
                      .user(user)
              .build());
    }
    var jwtToken = jwtService.generateToken(user);
    var refreshToken = jwtService.generateRefreshToken(user);
    saveUserToken(savedUser, jwtToken);
    return AuthenticationResponse.builder()
            .firstName(savedUser.getFirstname())
            .lastName(savedUser.getLastname())
        .accessToken(jwtToken)
            .refreshToken(refreshToken)
            .role(savedUser.getRole())
            .userId(savedUser.getUserId())
        .build();
  }

  public AuthenticationResponse authenticate(AuthenticationRequest request) {
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
            request.getEmail(),
            request.getPassword()
        )
    );

    var user = repository.findByEmail(request.getEmail())
        .orElseThrow();

//    if(!user.getRole().equals(request.getRole())) {
//      throw new AccessDeniedException("Not Authorised");
//    }

    var jwtToken = jwtService.generateToken(user);
    var refreshToken = jwtService.generateRefreshToken(user);
    revokeAllUserTokens(user);
    saveUserToken(user, jwtToken);

    Long patientId = null;
    Long doctorId = null;

    if(user.getRole().equals(Role.PATIENT)) {
      Patient patient = patientRepository.findPatientByUser(user).orElseThrow(() -> new RuntimeException("Patient not found"));
      patientId = patient.getPatientId();
    }

    if(user.getRole().equals(Role.DOCTOR)) {
      Doctor doctor = doctorRepository.findDoctorByUser(user).orElseThrow(() -> new RuntimeException("Doctor not found"));
      doctorId = doctor.getDoctorId();
    }

    return AuthenticationResponse.builder()
        .accessToken(jwtToken)
            .refreshToken(refreshToken)
            .firstName(user.getFirstname())
            .lastName(user.getLastname())
            .userId(user.getUserId())
            .role(user.getRole())
            .patientId(patientId)
            .doctorId(doctorId)
        .build();
  }

  private void saveUserToken(User user, String jwtToken) {
    var token = Token.builder()
        .user(user)
        .token(jwtToken)
        .tokenType(TokenType.BEARER)
        .expired(false)
        .revoked(false)
        .build();
    tokenRepository.save(token);
  }

  private void revokeAllUserTokens(User user) {
    var validUserTokens = tokenRepository.findAllValidTokenByUser(user.getUserId());
    if (validUserTokens.isEmpty())
      return;
    validUserTokens.forEach(token -> {
      token.setExpired(true);
      token.setRevoked(true);
    });
    tokenRepository.saveAll(validUserTokens);
  }

  public void refreshToken(
          HttpServletRequest request,
          HttpServletResponse response
  ) throws IOException {
    final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
    final String refreshToken;
    final String userEmail;
    if (authHeader == null ||!authHeader.startsWith("Bearer ")) {
      return;
    }
    refreshToken = authHeader.substring(7);
    userEmail = jwtService.extractUsername(refreshToken);
    if (userEmail != null) {
      var user = this.repository.findByEmail(userEmail)
              .orElseThrow();
      if (jwtService.isTokenValid(refreshToken, user)) {
        var accessToken = jwtService.generateToken(user);
        revokeAllUserTokens(user);
        saveUserToken(user, accessToken);
        var authResponse = AuthenticationResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
        new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
      }
    }
  }
}
