import type { Metadata } from "next";
import "./globals.css";

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
      <body className="antialiased min-h-screen bg-background text-foreground relative selection:bg-accent/30">
        {/* Ambient Background Gradients */}
        <div className="fixed inset-0 -z-10 h-full w-full bg-background">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        </div>
        {children}
      </body>
    </html>
  );
}
