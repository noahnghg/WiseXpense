package com.noahdev.wisexpense.plaid;

import com.noahdev.wisexpense.users.User;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "plaid_items")
@Data
public class PlaidItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String accessToken;

    @Column(nullable = false)
    private String itemId;

    @Column(name = "cursor_val") // 'cursor' is a reserved keyword in some DBs
    private String cursor;
}
