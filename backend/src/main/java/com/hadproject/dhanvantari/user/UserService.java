package com.hadproject.dhanvantari.user;

import com.hadproject.dhanvantari.aws.S3Service;
import com.hadproject.dhanvantari.error_handling.NotFoundException;
import com.hadproject.dhanvantari.user.dto.ChangePasswordRequest;
import com.hadproject.dhanvantari.user.dto.GetUserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;

@Service
@RequiredArgsConstructor
public class UserService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository repository;
    private final S3Service s3Service;
    private final UserRepository userRepository;

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
            System.out.println(user);
            if (!user.getUserId().toString().equals(userId)) {
                throw new NotFoundException("User not found");
            }
            byte[] fileContent = file.getBytes();
            String fileName = userId + "/" + file.getOriginalFilename();
            String contentType = file.getContentType();

            s3Service.uploadFile(fileName, fileContent, contentType);

            String url = s3Service.generatePresignedUrl(fileName);
            user.profile = fileName;

            userRepository.save(user);
        } catch (IOException e) {
            e.printStackTrace();
            throw e;
        }

    }

    public String getProfilePicture(String userId) {
        User user = userRepository.findById(Integer.valueOf(userId)).orElseThrow(() -> new NotFoundException("User not found"));

        return s3Service.generatePresignedUrl(user.profile);
    }

    public ResponseEntity<GetUserResponse> getUser(String userId) {
        User user = userRepository.findById(Integer.valueOf(userId)).orElseThrow(() -> new NotFoundException("User not found"));

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
}
