package com.hadproject.dhanvantari.abdm;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashMap;


@Service
@RequiredArgsConstructor
public class ABDMService {

    private String token;

    public ABDMService(String token) {
        this.token = token;
    }
    public String getToken() {
        return token;
    }

    public String setToken() throws Exception {

        var values = new HashMap<String, String>() {{
            put("clientId", "SBX_004950");
            put ("clientSecret", "b625b82c-8163-4ef7-a6c7-84479b7df216");
        }};

        var objectMapper = new ObjectMapper();
        String requestBody = objectMapper
                .writeValueAsString(values);
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://dev.abdm.gov.in/gateway/v0.5/sessions"))
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .header("Content-Type", "application/json")
                .build();
        HttpResponse<String> response = client.send(request,
                HttpResponse.BodyHandlers.ofString());
        JsonNode rootNode = objectMapper.readValue(response.body(), JsonNode.class);
        this.token = rootNode.get("accessToken").asText();

        return token;
    }

    public void generateOtp() {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://healthidsbx.abdm.gov.in/api/v2/registration/aadhaar/generateOtp"))
                .GET(HttpRequest.BodyPublishers.ofString(requestBody))
                .header("Content-Type", "application/json")
                .build();
        HttpResponse<String> response = client.send(request,
                HttpResponse.BodyHandlers.ofString());
        JsonNode rootNode = objectMapper.readValue(response.body(), JsonNode.class);
    }
}
