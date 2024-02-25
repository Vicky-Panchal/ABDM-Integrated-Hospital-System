package com.hadproject.dhanvantari.abdm;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashMap;
import javax.crypto.Cipher;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

@Getter
@Service
@RequiredArgsConstructor
public class ABDMService {

    private String token;
    private static final String RSA_ALGORITHM = "RSA";
    private static final String publicKeyString = "";
    @Value("${application.secrets.clientId}")
    private String clientId;
    @Value("${application.secrets.clientSecret}")
    private String clientSecret;

    public ABDMService(String token) {
        this.token = token;
    }

    public String setToken() throws Exception {

        var values = new HashMap<String, String>() {{
            put("clientId", clientId);
            put ("clientSecret", clientSecret);
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

    public String generateOtp(String aadhaarId) throws Exception {
        var values = new HashMap<String, String>() {{
            put("aadhaar", encryptData(aadhaarId));
        }};
        var objectMapper = new ObjectMapper();
        String requestBody = objectMapper
                .writeValueAsString(values);
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://healthidsbx.abdm.gov.in/api/v2/registration/aadhaar/generateOtp"))
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .header("Content-Type", "application/json")
                .build();
        HttpResponse<String> response = client.send(request,
                HttpResponse.BodyHandlers.ofString());
        JsonNode rootNode = objectMapper.readValue(response.body(), JsonNode.class);

        return rootNode.get("txn").asText();
    }

    public String encryptData(String data) throws Exception {
        byte[] publicKeyBytes = Base64.getDecoder().decode(publicKeyString);
        X509EncodedKeySpec keySpec = new X509EncodedKeySpec(publicKeyBytes);
        KeyFactory keyFactory = KeyFactory.getInstance(RSA_ALGORITHM);
        PublicKey publicKey = keyFactory.generatePublic(keySpec);

        Cipher cipher = Cipher.getInstance(RSA_ALGORITHM);
        cipher.init(Cipher.ENCRYPT_MODE, publicKey);
        byte[] encryptedBytes = cipher.doFinal(data.getBytes());
        return Base64.getEncoder().encodeToString(encryptedBytes);
    }


}
