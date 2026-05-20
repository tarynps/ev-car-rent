import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Sans_Thai_Looped } from "next/font/google";
import "./globals.css";
import { RoleProvider } from "@/lib/role-context";
import { ToastProvider } from "@/components/Toast";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const ibmPlexSansThai = IBM_Plex_Sans_Thai_Looped({
  variable: "--font-thai",
  subsets: ["thai"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
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
    <html lang="en" className={`${ibmPlexSans.variable} ${ibmPlexSansThai.variable} h-full`}>
      <body className="min-h-full font-sans bg-ev-bg text-ev-black antialiased">
        <RoleProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </RoleProvider>
      </body>
    </html>
  );
}
