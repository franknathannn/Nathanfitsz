'use client';

import { Inter, JetBrains_Mono } from "next/font/google";
import "../styles/globals.css"; 
import { Toaster } from "sonner";
import Navigation from "../components/organisms/Navigation"; 
import { usePathname } from "next/navigation";

// 1. IMPORT SUSPENSE
import { Suspense } from "react"; 

import AnalyticsTracker from "../components/AnalyticsTracker"; 

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body 
        className={`${inter.variable} ${jetbrains.variable} bg-background text-foreground antialiased relative selection:bg-neon selection:text-black overflow-x-hidden`}
        suppressHydrationWarning
      >
        {/* --- 2. WRAP TRACKER IN SUSPENSE --- */}
        {/* fallback={null} means "don't show a loading spinner, just show nothing until ready" */}
        {!isAdminPage && (
          <Suspense fallback={null}>
            <AnalyticsTracker />
          </Suspense>
        )}

        <Toaster 
          theme="dark" 
          position="top-center" 
          toastOptions={{
            style: { background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }
          }}
        />

        <div className="fixed inset-0 pointer-events-none z-[1] opacity-[0.12] mix-blend-overlay">
           <div className="absolute inset-0 bg-[url('/textures/noise.png')] animate-grain"></div>
        </div>

        <div className="fixed top-[-10%] left-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-electric/10 blur-[80px] md:blur-[120px] rounded-full pointer-events-none z-0 mix-blend-screen animate-float" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[350px] md:w-[700px] h-[350px] md:h-[700px] bg-neon/10 blur-[80px] md:blur-[120px] rounded-full pointer-events-none z-0 mix-blend-screen" />

        {!isAdminPage && (
          <div className="relative z-50">
            <Navigation />
          </div>
        )}

        <main className="relative z-10 flex flex-col min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}