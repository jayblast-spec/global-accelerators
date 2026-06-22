import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "../components/ui/Toast";
import { Header } from "../components/layout/Header";

export const metadata: Metadata = {
  title: "Global Accelerators For Startup Business",
  description: "The world's most complete, verified database of global startup accelerators. Search 500+ programs, read due diligence reports, and get AI-generated application templates.",
  openGraph: {
    title: "Global Accelerators For Startup Business",
    description: "Find the right accelerator for your startup. 500+ verified programs worldwide.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <Header />
          {/* pb-16 on mobile reserves space for the fixed bottom nav */}
          <div className="pb-16 md:pb-0">
            {children}
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}