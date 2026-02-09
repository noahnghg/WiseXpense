package com.noahdev.wisexpense.plaid;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.noahdev.wisexpense.users.User;
import com.noahdev.wisexpense.users.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PlaidController.class)
@AutoConfigureMockMvc(addFilters = false)
class PlaidControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PlaidService plaidService;

    @MockBean
    private UserRepository userRepository;

    // Required for context loading even if filters are disabled
    @MockBean
    private com.noahdev.wisexpense.config.JwtUtils jwtUtils;

    @MockBean
    private org.springframework.security.core.userdetails.UserDetailsService userDetailsService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(username = "test@example.com")
    void createLinkToken_Success() throws Exception {
        User user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(plaidService.createLinkToken(user)).thenReturn("link-sandbox-123");

        mockMvc.perform(post("/api/plaid/link-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.link_token").value("link-sandbox-123"));
    }

    @Test
    @WithMockUser(username = "test@example.com")
    void exchangePublicToken_Success() throws Exception {
        User user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");

        PublicTokenExchangeRequest request = new PublicTokenExchangeRequest();
        request.setPublicToken("public-sandbox-123");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        mockMvc.perform(post("/api/plaid/public-token")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        verify(plaidService).exchangePublicToken(eq(user), eq("public-sandbox-123"));
    }
}
