import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SessWrap from "@/components/SeWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppIns = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700", "100", "200", "300"],
  subsets: ["latin"],
});

export const metadata = {
  title: "Invoice - Make Your Dream Invoice",
  description: "This is one of the best Invoice Maker app in the World. It will save your Invoice in DateBase.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <SessWrap>
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${poppIns.variable} antialiased`}
        >
          <Navbar />
          <main className="min-h-[calc(100vh-510px)]">{children}</main>
          <Footer />
        </body>
      </SessWrap>
    </html>
  );
}


