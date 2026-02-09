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
        const response = await fetch("http://localhost:8080/api/plaid/link-token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // Assuming bearer token auth is set up or session based
                // If using JWT from AuthContext, add header:
                // "Authorization": `Bearer ${authToken}`
            },
        });
        const data = await response.json();
        setToken(data.link_token);
    }, [authToken]);

    useEffect(() => {
        getLinkToken();
    }, [getLinkToken]);

    const onSuccess = useCallback(async (publicToken: string) => {
        await fetch("http://localhost:8080/api/plaid/public-token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ publicToken }),
        });
        // Redirect to dashboard or success page
        router.push("/dashboard");
    }, [router]);

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
