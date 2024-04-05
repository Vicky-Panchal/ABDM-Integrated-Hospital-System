package com.hadproject.dhanvantari.postmark;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/mail")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class postmarkController {

    private final PostmarkService postmarkService;

//    @GetMapping("/sendMail")
//    public void sendMail() throws PostmarkException, IOException {
//        postmarkService.sendMail();
//    }
}
