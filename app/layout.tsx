import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import GalaxyHyperspace from "@/components/galaxy-hyperspace";
import { checkUser } from "@/lib/checkUser";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export const metadata = {
  title: "MeraBudget — Smart Finance",
  description: "Advanced Personal Finance Management by MeraBudget",
};

export default async function RootLayout({ children }) {
  await checkUser();
  return (
    <ClerkProvider>
      <html lang="en" className="dark" suppressHydrationWarning>
        <body className={`${spaceGrotesk.className} bg-[#030207] font-space-grotesk antialiased overflow-x-hidden`}>
          {/* CINEMATIC GALAXY OVERHAUL */}
          <GalaxyHyperspace />
          
          {/* OPTIMIZED GALAXY SHADING (Consolidated for Performance) */}
          <div 
            className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-80"
            style={{
              background: `
                radial-gradient(circle at -10% -10%, rgba(88, 28, 135, 0.4) 0%, transparent 70%),
                radial-gradient(circle at 110% 115%, rgba(30, 27, 75, 0.5) 0%, transparent 70%),
                radial-gradient(circle at 105% 25%, rgba(124, 58, 237, 0.15) 0%, transparent 60%),
                radial-gradient(circle at -10% 70%, rgba(76, 29, 149, 0.2) 0%, transparent 60%),
                radial-gradient(circle at 20% 40%, rgba(112, 26, 117, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 50% 50%, rgba(88, 28, 135, 0.05) 0%, transparent 80%)
              `
            }}
          />

          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            forcedTheme="dark"
            disableTransitionOnChange
          >
            <Navbar />
            <main className="relative z-10 min-h-screen">
              {children}
            </main>
            <Toaster richColors position="top-center" />

            <footer className="glass-card py-12 border-t border-white/10 mt-20 relative z-10 rounded-none bg-black/60 backdrop-blur-3xl">
              <div className="container mx-auto px-4 text-center">
                <p className="tracking-[0.2em] uppercase text-xs font-black text-gradient mb-3">MeraBudget — Your Personal Finance Partner</p>
                <p className="text-slate-400 text-[10px] font-bold opacity-80 tracking-widest">© MeraBudget. All rights reserved.</p>
              </div>
            </footer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
