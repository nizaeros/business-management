import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Business Management Platform",
  description: "Enterprise business management solution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`${geist.className} antialiased bg-gray-50`}>
        <div suppressHydrationWarning id="app-root">
          {children}
        </div>
      </body>
    </html>
  );
}
