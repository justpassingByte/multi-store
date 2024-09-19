// File: app/(root)/layout.tsx
import type { Metadata } from "next";

import "./globals.css";
import { Poppins } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { ModalProvider } from './providers/modal-provider';
import { ToastProvider } from './providers/toast-provider';

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Multi Store Admin Portal",
  description: "Managing your store",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <ClerkProvider>
          <ModalProvider />
          <ToastProvider />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
