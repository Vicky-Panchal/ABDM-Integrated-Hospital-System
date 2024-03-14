package com.hadproject.dhanvantari.abdm;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hadproject.dhanvantari.patient.*;
import io.jsonwebtoken.io.IOException;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

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
    private static final String RSA_PADDING = "RSA/ECB/PKCS1Padding";
    private static final String publicKeyString = "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAstWB95C5pHLXiYW59qyO" +
            "4Xb+59KYVm9Hywbo77qETZVAyc6VIsxU+UWhd/k/YtjZibCznB+HaXWX9TVTFs9N" +
            "wgv7LRGq5uLczpZQDrU7dnGkl/urRA8p0Jv/f8T0MZdFWQgks91uFffeBmJOb58u" +
            "68ZRxSYGMPe4hb9XXKDVsgoSJaRNYviH7RgAI2QhTCwLEiMqIaUX3p1SAc178ZlN" +
            "8qHXSSGXvhDR1GKM+y2DIyJqlzfik7lD14mDY/I4lcbftib8cv7llkybtjX1Aayf" +
            "Zp4XpmIXKWv8nRM488/jOAF81Bi13paKgpjQUUuwq9tb5Qd/DChytYgBTBTJFe7i" +
            "rDFCmTIcqPr8+IMB7tXA3YXPp3z605Z6cGoYxezUm2Nz2o6oUmarDUntDhq/PnkN" +
            "ergmSeSvS8gD9DHBuJkJWZweG3xOPXiKQAUBr92mdFhJGm6fitO5jsBxgpmulxpG" +
            "0oKDy9lAOLWSqK92JMcbMNHn4wRikdI9HSiXrrI7fLhJYTbyU3I4v5ESdEsayHXu" +
            "iwO/1C8y56egzKSw44GAtEpbAkTNEEfK5H5R0QnVBIXOvfeF4tzGvmkfOO6nNXU3" +
            "o/WAdOyV3xSQ9dqLY5MEL4sJCGY1iJBIAQ452s8v0ynJG5Yq+8hNhsCVnklCzAls" +
            "IzQpnSVDUVEzv17grVAw078CAwEAAQ==";

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

    public String encryptData(String data) throws Exception {
        byte[] publicKeyBytes = Base64.getDecoder().decode(publicKeyString);
        X509EncodedKeySpec keySpec = new X509EncodedKeySpec(publicKeyBytes);
        KeyFactory keyFactory = KeyFactory.getInstance(RSA_ALGORITHM);
        PublicKey publicKey = keyFactory.generatePublic(keySpec);

        Cipher cipher = Cipher.getInstance(RSA_PADDING);
        cipher.init(Cipher.ENCRYPT_MODE, publicKey);
        byte[] encryptedBytes = cipher.doFinal(data.getBytes());
        return Base64.getEncoder().encodeToString(encryptedBytes);
    }

    public GenerateOtpResponse generateOtp(String aadhaarId) throws Exception {
        setToken();
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
                .header("Authorization", "Bearer " + getToken())
                .build();
        HttpResponse<String> response = client.send(request,
                HttpResponse.BodyHandlers.ofString());
        JsonNode rootNode = objectMapper.readValue(response.body(), JsonNode.class);
        System.out.println(rootNode);
        return GenerateOtpResponse.builder()
                .txnId(rootNode.get("txnId").asText())
                .mobileNumber(rootNode.get("mobileNumber").asText())
                .build();
    }

    public VerifyOtpResponse verifyOtp(String otp, String txn) throws Exception, JsonProcessingException {
        setToken();
        var values = new HashMap<String, String>() {{
            put("otp", encryptData(otp));
            put("txnId", txn);
        }};
        var objectMapper = new ObjectMapper();
        String requestBody = objectMapper
                .writeValueAsString(values);

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://healthidsbx.abdm.gov.in/api/v2/registration/aadhaar/verifyOTP"))
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + getToken())
                .build();
        HttpResponse<String> response = client.send(request,
                HttpResponse.BodyHandlers.ofString());
        JsonNode rootNode = objectMapper.readValue(response.body(), JsonNode.class);
        System.out.println(rootNode);
        return VerifyOtpResponse.builder()
                .txnId(rootNode.get("txnId").asText())
                .build();
    }

    public CheckAndGenerateMobileOtpResponse checkAndGenerateMobileOTP(CheckAndGenerateMobileOtpRequest data) throws Exception, JsonProcessingException {
        setToken();
        System.out.println(data);
        var values = new HashMap<String, Object>() {{
            put("mobile", data.getMobile());
            put("txnId", data.getTxnId());
        }};
        System.out.println(values);
        var objectMapper = new ObjectMapper();
        String requestBody = objectMapper
                .writeValueAsString(values);

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://healthidsbx.abdm.gov.in/api/v2/registration/aadhaar/checkAndGenerateMobileOTP"))
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + getToken())
                .build();
        HttpResponse<String> response = client.send(request,
                HttpResponse.BodyHandlers.ofString());
        JsonNode rootNode = objectMapper.readValue(response.body(), JsonNode.class);
        System.out.println(rootNode);
        return CheckAndGenerateMobileOtpResponse.builder()
                .txnId(rootNode.get("txnId").asText())
                .mobileLinked(rootNode.get("mobileLinked").asBoolean())
                .build();
    }

    public CreateHealthIdByAadhaarResponse createHealthIdByAadhaar(CreateHealthIdByAadhaarRequest data) throws Exception, JsonProcessingException {
        setToken();
        var values = new HashMap<String, Object>() {{
            put("consent", data.isConsent());
            put("consentVersion", data.getConsentVersion());
            put("txnId", data.getTxnId());
        }};

        var objectMapper = new ObjectMapper();
        String requestBody = objectMapper
                .writeValueAsString(values);

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://healthidsbx.abdm.gov.in/api/v2/registration/aadhaar/createHealthIdByAdhaar"))
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + getToken())
                .build();
        HttpResponse<String> response = client.send(request,
                HttpResponse.BodyHandlers.ofString());
        JsonNode rootNode = objectMapper.readValue(response.body(), JsonNode.class);

        return CreateHealthIdByAadhaarResponse.builder()
                .token(rootNode.get("token").asText())
                .build();
    }

    public byte[] getCard(String token) throws Exception, IOException, RestClientException {
        setToken();


        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://healthidsbx.abdm.gov.in/api/v1/account/getCard"))
                .GET()
                .header("Content-Type", "application/json")
                .header("X-Token", "Bearer " + token)
                .header("Authorization", "Bearer " + getToken())
                .build();

        HttpResponse<byte[]> response = client.send(request, HttpResponse.BodyHandlers.ofByteArray());

        // Handle status code here if needed
        if (response.statusCode() != 200) {
            throw new IOException("Failed to fetch card: " + response.statusCode());
        }

        return response.body();
    }
}
