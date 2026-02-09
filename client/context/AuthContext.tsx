"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
    email: string;
    hasPlaidItem: boolean;
    // Add other user fields as needed based on your User entity
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, email: string, hasPlaidItem: boolean) => void;
    logout: () => void;
    isLoading: boolean;
    updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check for token on mount
        const storedToken = localStorage.getItem("token");
        const storedEmail = localStorage.getItem("userEmail");
        const storedHasPlaidItem = localStorage.getItem("hasPlaidItem") === "true";

        if (storedToken && storedEmail) {
            setToken(storedToken);
            setUser({ email: storedEmail, hasPlaidItem: storedHasPlaidItem });
        }
        setIsLoading(false);
    }, []);

    const login = (newToken: string, email: string, hasPlaidItem: boolean) => {
        localStorage.setItem("token", newToken);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("hasPlaidItem", String(hasPlaidItem));
        setToken(newToken);
        setUser({ email, hasPlaidItem });

        if (hasPlaidItem) {
            router.push("/dashboard");
        } else {
            router.push("/connect-bank");
        }
    };

    const updateUser = (updates: Partial<User>) => {
        if (user) {
            const newUser = { ...user, ...updates };
            setUser(newUser);
            if (updates.hasPlaidItem !== undefined) {
                localStorage.setItem("hasPlaidItem", String(updates.hasPlaidItem));
            }
        }
    };



    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        setToken(null);
        setUser(null);
        router.push("/");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
