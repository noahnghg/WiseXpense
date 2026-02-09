package com.noahdev.wisexpense.users;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.noahdev.wisexpense.config.JwtAuthenticationFilter;
import com.noahdev.wisexpense.config.SecurityConfig;
import com.noahdev.wisexpense.dto.AuthResponse;
import com.noahdev.wisexpense.dto.LoginRequest;
import com.noahdev.wisexpense.dto.RegisterRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
@AutoConfigureMockMvc(addFilters = false) // Disable security filters for simple controller testing
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    // We need to mock these beans because they are required by
    // SecurityConfig/JwtAuthenticationFilter
    // even if we disable filters, sometimes context load fails without them or if
    // we keep filters on.
    // simpler to just disable filters for unit testing the controller logic itself.
    @MockBean
    private UserRepository userRepository;

    @MockBean
    private com.noahdev.wisexpense.config.JwtUtils jwtUtils;

    @MockBean
    private org.springframework.security.core.userdetails.UserDetailsService userDetailsService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void register_Success() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setName("Test User");
        request.setEmail("test@example.com");
        request.setPassword("password");

        AuthResponse response = new AuthResponse("token", "User registered successfully", false);

        when(userService.register(any(RegisterRequest.class))).thenReturn(response);

        mockMvc.perform(post("/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User registered successfully"));
    }

    @Test
    void login_Success() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@example.com");
        request.setPassword("password");

        AuthResponse response = new AuthResponse("jwt-token", "Login successful", false);

        when(userService.login(any(LoginRequest.class))).thenReturn(response);

        mockMvc.perform(post("/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("jwt-token"));
    }
}
