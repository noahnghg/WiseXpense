"use client";

import React, { useCallback, useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface PlaidLinkButtonProps {
    className?: string;
}

export const PlaidLinkButton: React.FC<PlaidLinkButtonProps> = ({ className }) => {
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();
    const { token: authToken } = useAuth(); // rename to avoid conflict

    const getLinkToken = useCallback(async () => {
        if (!authToken) return;
        try {
            const response = await fetch("http://localhost:8080/api/plaid/link-token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`
                },
            });
            if (!response.ok) {
                console.error("Failed to fetch link token:", response.statusText);
                return;
            }
            const data = await response.json();
            setToken(data.link_token);
        } catch (error) {
            console.error("Error fetching link token:", error);
        }
    }, [authToken]);

    useEffect(() => {
        getLinkToken();
    }, [getLinkToken]);

    const onSuccess = useCallback(async (publicToken: string) => {
        if (!authToken) return;
        try {
            const response = await fetch("http://localhost:8080/api/plaid/public-token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`
                },
                body: JSON.stringify({ publicToken }),
            });
            if (!response.ok) {
                console.error("Failed to exchange public token:", response.statusText);
                return;
            }
            // Redirect to dashboard or success page
            router.push("/dashboard");
        } catch (error) {
            console.error("Error exchanging public token:", error);
        }
    }, [router, authToken]);

    const { open, ready } = usePlaidLink({
        token,
        onSuccess,
    });

    return (
        <Button onClick={() => open()} disabled={!ready || !token} className={className}>
            Connect Bank
        </Button>
    );
};
