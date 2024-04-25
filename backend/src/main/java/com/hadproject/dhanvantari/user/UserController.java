package com.hadproject.dhanvantari.user;

import com.hadproject.dhanvantari.user.dto.*;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @Operation(summary = "Change Password for the user")
    @PatchMapping("/changePassword")
    public ResponseEntity<?> changePassword(
          @RequestBody ChangePasswordRequest request,
          Principal connectedUser
    ) {
        userService.changePassword(request, connectedUser);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/uploadProfile")
    public ResponseEntity<String> uploadProfilePicture(@RequestParam("file") MultipartFile file,
                                                       @RequestParam("userId") String userId,
                                                       Principal connectedUser) {
        try {
            userService.uploadProfilePicture(file, userId, connectedUser);
            return ResponseEntity.ok("Profile picture uploaded successfully!");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload profile picture: " + e.getMessage());
        }
    }

    @GetMapping("/getProfilePicture")
    public ResponseEntity<String> getProfilePicture(@RequestParam("userId") String userId, Principal connectedUser) {
        String url = userService.getProfilePicture(userId, connectedUser);
        return ResponseEntity.ok(url);
    }

    @GetMapping("/getUser")
    public ResponseEntity<GetUserResponse> getUser(@RequestParam("userId") String userId) {
        return userService.getUser(userId);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        userService.forgotPassword(request.getEmail());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest resetPasswordRequest) {
        userService.resetPassword(resetPasswordRequest);
        return ResponseEntity.ok("Password reset successful");
    }
    @PutMapping("/update-profile")
    public ResponseEntity<String> updateUserProfileByEmail(@RequestBody ProfileUpdate profileUpdate, Principal connectedUser) {
        userService.updateUserProfileByEmail(profileUpdate, connectedUser);
        return ResponseEntity.ok("Profile Updated Successfully");
    }

}
