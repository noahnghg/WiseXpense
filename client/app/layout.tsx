import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "WiseXpense",
  description: "Master your financial climate",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jetbrainsMono.variable} antialiased min-h-screen bg-background text-foreground relative selection:bg-accent/30 font-mono`}>
        {/* 
            Ambient Background Gradients 
            Increased opacity and size for better visibility on dark backgrounds
        */}
        <div className="fixed inset-0 -z-10 h-full w-full pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] opacity-70" />
          <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-accent/15 rounded-full blur-[100px] opacity-60" />
          <div className="absolute bottom-[-10%] left-[20%] w-[35%] h-[35%] bg-primary/15 rounded-full blur-[120px] opacity-50" />
        </div>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
