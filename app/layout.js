import { Geist, Geist_Mono } from "next/font/google";
import { Jersey_15 } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const custfont = Jersey_15({
  variable: "--font-jersey",
  subsets: ["latin"],
  weight: '400',
})

export const metadata = {
  title: "Ring Ring Bark Bark",
  description: "A funny",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${custfont.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
