package com.noahdev.wisexpense.dto;

public class AuthResponse {
    private String token;
    private String message;
    private boolean hasPlaidItem;

    public AuthResponse() {
    }

    public AuthResponse(String token, String message, boolean hasPlaidItem) {
        this.token = token;
        this.message = message;
        this.hasPlaidItem = hasPlaidItem;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isHasPlaidItem() {
        return hasPlaidItem;
    }

    public void setHasPlaidItem(boolean hasPlaidItem) {
        this.hasPlaidItem = hasPlaidItem;
    }
}
