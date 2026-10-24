// Self-hosted fonts via Fontsource (the sandboxed preview network cannot
// reach Google Fonts at compile time). Same CSS variables as before, so the
// Tailwind `font-display` / `font-body` families keep working unchanged.
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/700.css";
import "@fontsource/barlow-condensed/400.css";
import "@fontsource/barlow-condensed/500.css";
import "@fontsource/barlow-condensed/600.css";
import "@fontsource/barlow-condensed/700.css";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Velox Rentals | Premium Car Rental & Chauffeur Services",
  description:
    "Experience the ultimate in automotive luxury. Rent premium sports cars, SUVs, and luxury sedans with Velox Rentals.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      style={{
        "--font-cormorant": "'Cormorant Garamond', serif",
        "--font-barlow": "'Barlow Condensed', sans-serif",
      }}
      className="scroll-smooth"
    >
      <body className="bg-obsidian-900 text-platinum-50 font-body antialiased selection:bg-gold/30 selection:text-gold-light min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
