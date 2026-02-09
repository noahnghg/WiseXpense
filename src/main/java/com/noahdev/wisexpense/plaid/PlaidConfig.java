package com.noahdev.wisexpense.plaid;

import com.plaid.client.request.PlaidApi;
import com.plaid.client.ApiClient;
import io.github.cdimascio.dotenv.Dotenv;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;

@Configuration
public class PlaidConfig {

    private String clientId;
    private String secret;

    @PostConstruct
    public void init() {
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
        this.clientId = dotenv.get("PLAID_CLIENT_ID");
        if (this.clientId == null) {
            this.clientId = System.getenv("PLAID_CLIENT_ID");
        }

        this.secret = dotenv.get("PLAID_SECRET");
        if (this.secret == null) {
            this.secret = System.getenv("PLAID_SECRET");
        }
    }

    @Bean
    public PlaidApi plaidApi() {
        HashMap<String, String> apiKeys = new HashMap<>();
        apiKeys.put("clientId", clientId);
        apiKeys.put("secret", secret);

        ApiClient apiClient = new ApiClient(apiKeys);
        apiClient.setPlaidAdapter(ApiClient.Sandbox); // Sandbox environment

        return apiClient.createService(PlaidApi.class);
    }
}
