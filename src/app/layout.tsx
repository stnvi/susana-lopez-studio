import type { Metadata } from "next";
import { Lato, Playfair_Display } from "next/font/google";
import "./globals.css";
import Footer from '@/components/footer';
import { DevControlProvider } from '@/context/DevControlContext';
import MaintenanceGuard from '@/components/MaintenanceGuard';
import MaintenanceMode from '@/components/MaintenanceMode';

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Susana López Studio",
  description: "Hipopilates & Suelo Pélvico - Estudio boutique en Salamanca",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${lato.variable} ${playfair.variable} bg-background text-foreground font-sans antialiased`}
      >
        <DevControlProvider>
          <MaintenanceMode />
          <MaintenanceGuard>
            {children}
            <Footer />
          </MaintenanceGuard>
        </DevControlProvider>
      </body>
    </html>
  );
}
