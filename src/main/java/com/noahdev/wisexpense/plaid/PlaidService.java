package com.noahdev.wisexpense.plaid;

import com.noahdev.wisexpense.users.User;
import com.plaid.client.request.PlaidApi;
import com.plaid.client.model.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import retrofit2.Response;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PlaidService {

    private final PlaidApi plaidApi;
    private final PlaidItemRepository plaidItemRepository;

    public String createLinkToken(User user) throws IOException {
        LinkTokenCreateRequestUser userParams = new LinkTokenCreateRequestUser()
                .clientUserId(user.getId().toString());

        LinkTokenCreateRequest request = new LinkTokenCreateRequest()
                .user(userParams)
                .clientName("Wisexpense")
                .products(Arrays.asList(Products.TRANSACTIONS))
                .countryCodes(Arrays.asList(CountryCode.US))
                .language("en");

        Response<LinkTokenCreateResponse> response = plaidApi.linkTokenCreate(request).execute();

        if (!response.isSuccessful()) {
            throw new RuntimeException("Failed to create link token: " + response.errorBody().string());
        }

        return response.body().getLinkToken();
    }

    public void exchangePublicToken(User user, String publicToken) throws IOException {
        ItemPublicTokenExchangeRequest request = new ItemPublicTokenExchangeRequest()
                .publicToken(publicToken);

        Response<ItemPublicTokenExchangeResponse> response = plaidApi.itemPublicTokenExchange(request).execute();

        if (!response.isSuccessful()) {
            throw new RuntimeException("Failed to exchange public token: " + response.errorBody().string());
        }

        ItemPublicTokenExchangeResponse body = response.body();

        PlaidItem plaidItem = new PlaidItem();
        plaidItem.setUser(user);
        plaidItem.setAccessToken(body.getAccessToken());
        plaidItem.setItemId(body.getItemId());

        plaidItemRepository.save(plaidItem);
    }
}
