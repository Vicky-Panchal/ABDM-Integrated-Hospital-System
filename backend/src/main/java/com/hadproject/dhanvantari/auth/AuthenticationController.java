package com.hadproject.dhanvantari.auth;

import com.hadproject.dhanvantari.auth.dto.AuthenticationRequest;
import com.hadproject.dhanvantari.auth.dto.AuthenticationResponse;
import com.hadproject.dhanvantari.auth.dto.RegisterRequest;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {
  Logger logger = LoggerFactory.getLogger(AuthenticationController.class);
  private final AuthenticationService service;

  @Operation(summary = "Register a new user")
  @PostMapping("/register")
  public ResponseEntity<AuthenticationResponse> register(
      @RequestBody RegisterRequest request
  ) {
    return ResponseEntity.ok(service.register(request));
  }

  @Operation(summary = "Authenticate user for logging")
  @PostMapping("/authenticate")
  public ResponseEntity<AuthenticationResponse> authenticate(
      @RequestBody AuthenticationRequest request
  ) {
    logger.info("Login Successfully");
    return ResponseEntity.ok(service.authenticate(request));
  }

  @Operation(summary = "To refresh the access token")
  @PostMapping("/refresh-token")
  public void refreshToken(
      HttpServletRequest request,
      HttpServletResponse response
  ) throws IOException {
    service.refreshToken(request, response);
  }


}
