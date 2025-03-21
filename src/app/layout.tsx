'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { useEffect } from 'react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(registration => {
            console.info('Service Worker enregistré avec succès', registration);
          })
          .catch(error => {
            console.log('Échec de l\'enregistrement du Service Worker:', error);
          });
      });
    }
  }, []);

  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
