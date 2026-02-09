package com.noahdev.wisexpense.plaid;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PlaidItemRepository extends JpaRepository<PlaidItem, Long> {
    List<PlaidItem> findAllByUserId(Long userId);

    Optional<PlaidItem> findByItemId(String itemId);

    boolean existsByUserId(Long userId);
}
