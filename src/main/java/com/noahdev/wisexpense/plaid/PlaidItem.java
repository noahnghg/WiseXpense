package com.noahdev.wisexpense.plaid;

import com.noahdev.wisexpense.users.User;
import jakarta.persistence.*;

@Entity
@Table(name = "plaid_items")
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

    public PlaidItem() {
    }

    public PlaidItem(Long id, User user, String accessToken, String itemId, String cursor) {
        this.id = id;
        this.user = user;
        this.accessToken = accessToken;
        this.itemId = itemId;
        this.cursor = cursor;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getItemId() {
        return itemId;
    }

    public void setItemId(String itemId) {
        this.itemId = itemId;
    }

    public String getCursor() {
        return cursor;
    }

    public void setCursor(String cursor) {
        this.cursor = cursor;
    }
}
