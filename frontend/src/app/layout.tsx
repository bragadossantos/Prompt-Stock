import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "PromptStock — Discover, Use and Sell Better Prompts",
  description: "A plataforma e marketplace líder para descoberta, organização, compra e venda de prompts para Inteligência Artificial.",
  keywords: ["AI Prompts", "Midjourney", "ChatGPT", "Claude", "Marketplace de Prompts", "Prompt Engineering"],
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.svg",
  },
  openGraph: {
    title: "PromptStock — The Marketplace for Better Prompts",
    description: "Encontre os melhores prompts testados para ChatGPT, Midjourney e Claude.",
    url: "https://promptstock.com",
    siteName: "PromptStock",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className="min-h-screen flex flex-col bg-background text-slate-100 antialiased selection:bg-brand-600 selection:text-white">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
