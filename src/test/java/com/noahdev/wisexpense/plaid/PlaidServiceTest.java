package com.noahdev.wisexpense.plaid;

import com.noahdev.wisexpense.users.User;
import com.plaid.client.model.ItemPublicTokenExchangeResponse;
import com.plaid.client.model.LinkTokenCreateRequest;
import com.plaid.client.model.LinkTokenCreateResponse;
import com.plaid.client.request.PlaidApi;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import retrofit2.Call;
import retrofit2.Response;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PlaidServiceTest {

    @Mock
    private PlaidApi plaidApi;

    @Mock
    private PlaidItemRepository plaidItemRepository;

    @Mock
    private Call<LinkTokenCreateResponse> linkTokenCall;

    @Mock
    private Call<ItemPublicTokenExchangeResponse> publicTokenCall;

    private PlaidService plaidService;

    @BeforeEach
    void setUp() {
        plaidService = new PlaidService(plaidApi, plaidItemRepository);
    }

    @Test
    void createLinkToken_Success() throws IOException {
        User user = new User();
        user.setId(1L);

        LinkTokenCreateResponse responseBody = new LinkTokenCreateResponse();
        responseBody.setLinkToken("link-sandbox-123");
        Response<LinkTokenCreateResponse> response = Response.success(responseBody);

        when(plaidApi.linkTokenCreate(any(LinkTokenCreateRequest.class))).thenReturn(linkTokenCall);
        when(linkTokenCall.execute()).thenReturn(response);

        String linkToken = plaidService.createLinkToken(user);

        assertEquals("link-sandbox-123", linkToken);
        verify(plaidApi).linkTokenCreate(any(LinkTokenCreateRequest.class));
    }

    @Test
    void exchangePublicToken_Success() throws IOException {
        User user = new User();
        user.setId(1L);
        String publicToken = "public-sandbox-123";

        ItemPublicTokenExchangeResponse responseBody = new ItemPublicTokenExchangeResponse();
        responseBody.setAccessToken("access-sandbox-123");
        responseBody.setItemId("item-123");
        Response<ItemPublicTokenExchangeResponse> response = Response.success(responseBody);

        when(plaidApi.itemPublicTokenExchange(any())).thenReturn(publicTokenCall);
        when(publicTokenCall.execute()).thenReturn(response);

        plaidService.exchangePublicToken(user, publicToken);

        verify(plaidItemRepository).save(any(PlaidItem.class));
        verify(plaidApi).itemPublicTokenExchange(any());
    }
}
