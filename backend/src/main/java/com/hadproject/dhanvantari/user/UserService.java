package com.hadproject.dhanvantari.user;

import com.hadproject.dhanvantari.aws.S3Service;
import com.hadproject.dhanvantari.error_handling.NotFoundException;
import com.hadproject.dhanvantari.postmark.PostmarkService;
import com.hadproject.dhanvantari.user.dto.ChangePasswordRequest;
import com.hadproject.dhanvantari.user.dto.GetUserResponse;
import com.hadproject.dhanvantari.user.dto.ProfileUpdate;
import com.hadproject.dhanvantari.user.dto.ResetPasswordRequest;
import com.postmarkapp.postmark.client.exception.PostmarkException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.time.OffsetDateTime;
import java.util.Objects;
import java.util.Random;
import java.util.UUID;

import java.io.IOException;
import java.security.Principal;

@Service
@RequiredArgsConstructor
public class UserService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository repository;
    private final S3Service s3Service;
    private final UserRepository userRepository;
    private final OtpRepository otpRepository;
    private final PostmarkService postmarkService;

    public void changePassword(ChangePasswordRequest request, Principal connectedUser) {

        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();

        // check if the current password is correct
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalStateException("Wrong password");
        }
        // check if the two new passwords are the same
        if (!request.getNewPassword().equals(request.getConfirmationPassword())) {
            throw new IllegalStateException("Password are not the same");
        }

        // update the password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        // save the new password
        repository.save(user);
    }

   public void uploadProfilePicture(MultipartFile file, String userId, Principal connectedUser) throws IOException {
        try {
            var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
            if (!user.getUserId().toString().equals(userId)) {
                throw new NotFoundException("User not found");
            }
            byte[] fileContent = file.getBytes();
            String fileName = userId + "/" + file.getOriginalFilename();
            String contentType = file.getContentType();

            s3Service.uploadFile(fileName, fileContent, contentType);

            String url = s3Service.generatePresignedUrl(fileName);

            user.setProfile(fileName);
            userRepository.save(user);
        } catch (IOException e) {
            e.printStackTrace();
            throw e;
        }
    }

    public String getProfilePicture(String userId, Principal connectedUser) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        if (!user.getUserId().toString().equals(userId)) {
            throw new NotFoundException("User not found");
        }
        if(user.getProfile() == null) {
            throw new NotFoundException("Profile picture not found");
        }
        return s3Service.generatePresignedUrl(user.getProfile());
    }

    public ResponseEntity<GetUserResponse> getUser(String userId) {
        User user = userRepository.findById(Long.valueOf(userId)).orElseThrow(() -> new NotFoundException("User not found"));

        return ResponseEntity.ok(GetUserResponse.builder()
                .id(String.valueOf(user.getUserId()))
                .firstname(user.getFirstname())
                .middlename(user.getMiddlename())
                .lastname(user.getLastname())
                .email(user.getEmail())
                .dob(user.getDob())
                .gender(user.getGender())
                .mobile(user.getMobile())
                .healthId(user.healthId)
                .healthIdNumber(user.healthIdNumber)
                .build()
        );
    }

    public void forgotPassword(String email) {
        try {
            // Create a new Postmark message
            User user = userRepository.findByEmail(email).orElseThrow(() -> new NotFoundException("User not found"));
            Random random = new Random();

            // Generate a random integer between 100000 (inclusive) and 999999 (exclusive)
            String randomId = String.valueOf(random.nextInt(900000) + 100000);

            Otp otp = otpRepository.findByUser(user).orElse(new Otp()); // Create new OTP entity if none exists

            // Update OTP value and associate it with the user
            otp.setOtp(randomId);
            otp.setUser(user);

            // Save the updated or new OTP entity
            otpRepository.save(otp);


            postmarkService.sendMail(email, "Forgot Password Otp", "Your Otp is " + randomId);


            // Send the message using PostmarkClient
        } catch (PostmarkException | IOException e) {
            // Handle exceptions
            e.printStackTrace();
            throw new RuntimeException("Failed to send password reset email");
        }
    }
    public void resetPassword(ResetPasswordRequest resetPasswordRequest) {

        User user = userRepository.findByEmail(resetPasswordRequest.getEmail()).orElseThrow(() -> new NotFoundException("User not found"));

        Otp otp = otpRepository.findOtpByUserEmail(user.getEmail());

        if(!Objects.equals(otp.getOtp(), resetPasswordRequest.getOtp())) {
            throw new RuntimeException("Otp is incorrect");
        }

        String password = passwordEncoder.encode(resetPasswordRequest.getNewPassword());

        user.setPassword(password);

        userRepository.save(user);
    }
    public void updateUserProfileByEmail(ProfileUpdate profileUpdate, Principal connectedUser) {
        // Find user by email and update the profile fields
        // Assuming UserRepository has a method to find user by email
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();

        // Update user profile fields
        user.setFirstname(profileUpdate.getFirstname() != null ? profileUpdate.getFirstname() : user.getFirstname());
        user.setMiddlename(profileUpdate.getMiddlename() != null ? profileUpdate.getMiddlename() : user.getMiddlename());
        user.setLastname(profileUpdate.getLastname() != null ? profileUpdate.getLastname() : user.getLastname());
        user.setGender(profileUpdate.getGender() != null ? profileUpdate.getGender() : user.getGender());
        user.setDob(profileUpdate.getDob() != null ? profileUpdate.getDob() : user.getDob());
        user.setMobile(profileUpdate.getMobile() != null ? profileUpdate.getMobile() : user.getMobile());

        // Update other fields as needed

        // Save the updated user
        userRepository.save(user);
    }


}
