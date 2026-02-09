package com.noahdev.wisexpense.users;

import com.noahdev.wisexpense.config.JwtUtils;
import com.noahdev.wisexpense.dto.AuthResponse;
import com.noahdev.wisexpense.dto.LoginRequest;
import com.noahdev.wisexpense.dto.RegisterRequest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtils jwtUtils,
            AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setHashedPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);

        return new AuthResponse(null, "User registered successfully");
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Create UserDetails for token generation
        var userDetails = new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getHashedPassword(),
                java.util.Collections.emptyList());

        String jwtToken = jwtUtils.generateToken(userDetails);
        return new AuthResponse(jwtToken, "Login successful");
    }
}