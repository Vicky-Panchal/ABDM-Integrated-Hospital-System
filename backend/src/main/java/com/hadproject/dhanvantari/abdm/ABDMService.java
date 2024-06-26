package com.hadproject.dhanvantari.abdm;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hadproject.dhanvantari.patient.dto.*;
import io.jsonwebtoken.io.IOException;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Cipher;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.HashMap;

import static com.hadproject.dhanvantari.abdm.ABDMServiceHelper.*;

@Getter
@Service
@RequiredArgsConstructor
public class ABDMService {
    Logger logger = LoggerFactory.getLogger(ABDMService.class);
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

        try {
            var values = new HashMap<String, String>() {{
                put("clientId", clientId);
                put("clientSecret", clientSecret);
            }};

            var objectMapper = new ObjectMapper();
            String requestBody = objectMapper.writeValueAsString(values);
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://dev.abdm.gov.in/gateway/v0.5/sessions"))
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .header("Content-Type", "application/json")
                    .build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            // Check if response is successful
            if (response.statusCode() != 200) {
                throw new RuntimeException("Failed to obtain token: " + response.body());
            }

            JsonNode rootNode = objectMapper.readValue(response.body(), JsonNode.class);
            this.token = rootNode.get("accessToken").asText();

            return token;
        } catch (Exception e) {
            throw new Exception("Failed to set token: " + e.getMessage(), e);
        }
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
        if (response.statusCode() != 200) {
            throw new RuntimeException("Failed to obtain token: " + response.body());
        }

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

        if (response.statusCode() != 200) {
            throw new RuntimeException("Failed to obtain token: " + response.body());
        }
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

        if (response.statusCode() != 200) {
            throw new RuntimeException("Failed to obtain token: " + response.body());
        }
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

        if (response.statusCode() != 200) {
            throw new RuntimeException("Failed to obtain token: " + response.body());
        }
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

    //------------------------PATIENT REGISSTRATION FLOW---------------------
    public String patientInitUsingMobile(String abhaId) throws Exception {
        logger.info("entering fireABDM with data: {}", abhaId);
        setToken();
        if (token.equals("-1")) return null;

        JSONObject requestBody = prepareGenerateOTPEntity(abhaId);

        HttpClient client = HttpClient.newHttpClient();
        System.out.println(requestBody);
        // Prepare request body
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://dev.abdm.gov.in/gateway/v0.5/users/auth/init"))
                .POST(HttpRequest.BodyPublishers.ofString(requestBody.toString()))
                .header("Content-Type", "application/json")
                .header("X-CM-ID", "sbx")
                .header("Authorization", "Bearer "+ token)
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        // Print response body
        System.out.println(response);

        return requestBody.get("requestId").toString();
    }

    public String[] prepareOnGenerateResponse(String response) {
        logger.info("entering prepareOnGenerateResponse with data: {}", response);
        String[] ans = new String[2];

        JSONObject obj = new JSONObject(response);
        JSONObject respond = new JSONObject();

        if (!obj.isNull("error")) {
            respond.put("status", HttpStatus.BAD_REQUEST);
            respond.put("message", obj.getJSONObject("error").get("message").toString());
        }
        else {
            JSONObject auth = obj.getJSONObject("auth");
            respond.put("status", HttpStatus.ACCEPTED);
            respond.put("message", "OTP sent Successfully");
            respond.put("data", new JSONObject().put("transactionId", auth.getString("transactionId")));
        }

        ans[1] = respond.toString();
        ans[0] = obj.getJSONObject("resp").get("requestId").toString();
        logger.info("Entering prepareOnGenerateResponse with data: " + ans.toString() );
        return ans;
    }

    public String patientConfirmOTP(String transactionId, String OTP) throws Exception {
        logger.info("entering fireABDMConfirmOTP with data: transactionId: " + transactionId + " OTP: " + OTP);
        setToken();
        if (token.equals("-1")) return null;

        RestTemplate restTemplate = new RestTemplate();

        JSONObject request = prepareConfirmOTPRequest(transactionId, OTP);
        HttpHeaders headers = prepareHeader(token);

        HttpEntity<String> entity = new HttpEntity<String>(request.toString(), headers);
        restTemplate.postForObject("https://dev.abdm.gov.in/gateway/v0.5/users/auth/confirm", entity, String.class);
        logger.info("returning requestID: " + request.get("requestId").toString());
        return request.get("requestId").toString();
    }
}
