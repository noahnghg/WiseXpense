package com.noahdev.wisexpense.plaid;

import com.noahdev.wisexpense.users.User;
import com.noahdev.wisexpense.transactions.TransactionRepository;
import com.plaid.client.request.PlaidApi;
import com.plaid.client.model.*;
import org.springframework.stereotype.Service;
import retrofit2.Response;

import java.io.IOException;
import java.util.Arrays;

@Service
public class PlaidService {

    private final PlaidApi plaidApi;
    private final PlaidItemRepository plaidItemRepository;
    private final TransactionRepository transactionRepository;

    public PlaidService(PlaidApi plaidApi, PlaidItemRepository plaidItemRepository,
            TransactionRepository transactionRepository) {
        this.plaidApi = plaidApi;
        this.plaidItemRepository = plaidItemRepository;
        this.transactionRepository = transactionRepository;
    }

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

        // Sync initial transactions
        syncTransactions(user);
    }

    public void syncTransactions(User user) throws IOException {
        PlaidItem plaidItem = plaidItemRepository.findAll().stream()
                .filter(item -> item.getUser().getId().equals(user.getId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Plaid item not found for user"));

        String cursor = plaidItem.getCursor();
        boolean hasMore = true;

        while (hasMore) {
            TransactionsSyncRequest request = new TransactionsSyncRequest()
                    .accessToken(plaidItem.getAccessToken())
                    .cursor(cursor);

            Response<TransactionsSyncResponse> response = plaidApi.transactionsSync(request).execute();

            if (!response.isSuccessful()) {
                throw new RuntimeException("Failed to sync transactions: " + response.errorBody().string());
            }

            TransactionsSyncResponse body = response.body();

            // Handle added transactions
            for (com.plaid.client.model.Transaction plaidTx : body.getAdded()) {
                com.noahdev.wisexpense.transactions.Transaction tx = new com.noahdev.wisexpense.transactions.Transaction();
                tx.setUser(user);
                tx.setPlaidTransactionId(plaidTx.getTransactionId());
                tx.setAccountId(plaidTx.getAccountId());
                tx.setAmount(plaidTx.getAmount());
                tx.setDate(plaidTx.getDate());
                tx.setName(plaidTx.getName());
                tx.setMerchantName(plaidTx.getMerchantName());
                if (plaidTx.getPersonalFinanceCategory() != null) {
                    tx.setCategory(plaidTx.getPersonalFinanceCategory().getPrimary());
                }
                if (plaidTx.getLogoUrl() != null) {
                    tx.setLogoUrl(plaidTx.getLogoUrl());
                }
                transactionRepository.save(tx);
            }

            // Handle modified transactions
            for (com.plaid.client.model.Transaction plaidTx : body.getModified()) {
                transactionRepository.findByPlaidTransactionId(plaidTx.getTransactionId()).ifPresent(tx -> {
                    tx.setAmount(plaidTx.getAmount());
                    tx.setDate(plaidTx.getDate());
                    tx.setName(plaidTx.getName());
                    tx.setMerchantName(plaidTx.getMerchantName());
                    if (plaidTx.getPersonalFinanceCategory() != null) {
                        tx.setCategory(plaidTx.getPersonalFinanceCategory().getPrimary());
                    }
                    if (plaidTx.getLogoUrl() != null) {
                        tx.setLogoUrl(plaidTx.getLogoUrl());
                    }
                    transactionRepository.save(tx);
                });
            }

            // Handle removed transactions
            for (RemovedTransaction removedTx : body.getRemoved()) {
                transactionRepository.findByPlaidTransactionId(removedTx.getTransactionId())
                        .ifPresent(transactionRepository::delete);
            }

            cursor = body.getNextCursor();
            hasMore = body.getHasMore();
        }

        plaidItem.setCursor(cursor);
        plaidItemRepository.save(plaidItem);
    }
}
