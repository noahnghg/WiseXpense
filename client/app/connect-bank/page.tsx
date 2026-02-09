"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaidLinkButton } from "@/components/PlaidLinkButton";

export default function ConnectBankPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <CardTitle>Connect Your Bank</CardTitle>
                    <CardDescription>
                        Link your bank account to start tracking your expenses automatically.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <PlaidLinkButton className="w-full" />
                </CardContent>
            </Card>
        </div>
    );
}
