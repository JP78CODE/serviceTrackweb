import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ServiceTrack — Sistem Pencatatan Servis',
  description: 'Aplikasi Manajemen Transaksi dan Tracking Biaya Servis Terstruktur',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="bg-slate-50 min-h-screen text-slate-800 antialiased flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
