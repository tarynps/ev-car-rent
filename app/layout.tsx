import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { RoleProvider } from "@/lib/role-context";
import { ToastProvider } from "@/components/Toast";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "EV Car Rental — B2B Platform",
  description: "B2B platform for EV car rental management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ibmPlexSans.variable} h-full`}>
      <body className="min-h-full antialiased">
        <RoleProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </RoleProvider>
      </body>
    </html>
  );
}
