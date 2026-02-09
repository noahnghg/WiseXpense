package com.noahdev.wisexpense.plaid;

import com.noahdev.wisexpense.users.User;
import com.noahdev.wisexpense.users.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/plaid")
@RequiredArgsConstructor
public class PlaidController {

    private final PlaidService plaidService;
    private final UserRepository userRepository;

    @PostMapping("/link-token")
    public ResponseEntity<Map<String, String>> createLinkToken(@AuthenticationPrincipal UserDetails userDetails)
            throws IOException {
        User user = getUser(userDetails);
        String linkToken = plaidService.createLinkToken(user);
        return ResponseEntity.ok(Collections.singletonMap("link_token", linkToken));
    }

    @PostMapping("/public-token")
    public ResponseEntity<Void> exchangePublicToken(@AuthenticationPrincipal UserDetails userDetails,
            @RequestBody PublicTokenExchangeRequest request) throws IOException {
        User user = getUser(userDetails);
        plaidService.exchangePublicToken(user, request.getPublicToken());
        return ResponseEntity.ok().build();
    }

    private User getUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
