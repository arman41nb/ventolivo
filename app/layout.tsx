import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ventolivo — Handcrafted Artisan Soaps",
  description:
    "Handcrafted artisan soaps made with natural oils and botanicals. Made in Denizli.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
