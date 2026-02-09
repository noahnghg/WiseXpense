package com.noahdev.wisexpense.plaid;

public class PublicTokenExchangeRequest {
    private String publicToken;

    public PublicTokenExchangeRequest() {
    }

    public PublicTokenExchangeRequest(String publicToken) {
        this.publicToken = publicToken;
    }

    public String getPublicToken() {
        return publicToken;
    }

    public void setPublicToken(String publicToken) {
        this.publicToken = publicToken;
    }
}
