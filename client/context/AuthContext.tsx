"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
    email: string;
    // Add other user fields as needed based on your User entity
    // For now, minimal.
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, email: string) => void;
    logout: () => void;
    isLoading: boolean;
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

        if (storedToken && storedEmail) {
            setToken(storedToken);
            setUser({ email: storedEmail });
        }
        setIsLoading(false);
    }, []);

    const login = (newToken: string, email: string) => {
        localStorage.setItem("token", newToken);
        localStorage.setItem("userEmail", email);
        setToken(newToken);
        setUser({ email });
        router.push("/dashboard");
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        setToken(null);
        setUser(null);
        router.push("/");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
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
