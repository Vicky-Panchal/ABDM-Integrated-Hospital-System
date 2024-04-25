package com.hadproject.dhanvantari.postmark;

import com.postmarkapp.postmark.Postmark;
import com.postmarkapp.postmark.client.ApiClient;
import com.postmarkapp.postmark.client.data.model.message.Message;
import com.postmarkapp.postmark.client.data.model.message.MessageResponse;
import com.postmarkapp.postmark.client.exception.PostmarkException;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Getter
@Service
@RequiredArgsConstructor
public class PostmarkService {

    public void sendMail(String toMail, String subject, String htmlBody) throws PostmarkException, IOException {
        ApiClient client = Postmark.getApiClient("2374a043-b3bf-4913-b797-185abfd7d9d2");
        Message message = new Message("vicky.panchal@iiitb.ac.in", toMail, subject, htmlBody);
        message.setMessageStream("dhanvantari-development");
        MessageResponse response = client.deliverMessage(message);
    }
}
