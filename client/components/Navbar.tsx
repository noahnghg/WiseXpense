import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md border-b border-black/5 dark:border-white/10">
            <Link href="/" className="text-2xl font-serif font-bold text-primary">
                WiseXpense
            </Link>
            <div className="flex items-center gap-4">
                <Link href="/dashboard">
                    <Button variant="ghost" className="font-sans">Login</Button>
                </Link>
                <Link href="/dashboard">
                    <Button className="font-sans">Sign Up</Button>
                </Link>
            </div>
        </nav>
    );
}
