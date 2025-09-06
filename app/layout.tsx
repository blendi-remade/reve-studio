import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Banana Peel - Where Images Evolve Through AI Comments",
  description: "The social app where every comment transforms images with AI. Drop a prompt, watch nano banana work its magic, and see your ideas come to life through collaborative visual storytelling.",
  keywords: ["AI image generation", "social media", "image editing", "nano banana", "collaborative art", "prompt-based AI"],
  openGraph: {
    title: "Banana Peel - Where Images Evolve Through AI Comments",
    description: "The social app where every comment transforms images with AI. Join the visual conversation!",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Banana Peel - Where Images Evolve Through AI Comments", 
    description: "Drop a prompt, watch AI transform images, join the visual conversation. Like Reddit, but every comment is magic! 🍌✨",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="border-b-2 border-black border-dashed">
              <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="border-2 border-black bg-yellow-200 px-4 py-2 rotate-[1deg] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <h1 className="text-xl font-bold flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      Banana Peel
                    </h1>
                  </div>
                  <Badge variant="outline" className="rotate-[-1deg] border-2 border-black font-mono">
                    🍌 hackathon
                  </Badge>
                </div>
                
                {/* Profile dropdown in top right */}
                <ProfileDropdown />
              </div>
            </header>

            {/* Main content */}
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
