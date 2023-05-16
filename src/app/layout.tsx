import WalletContextProvider from "@/contexts/Metamask";
import "./globals.scss";
import LocalFont from "next/font/local";
import { Toaster } from "react-hot-toast";

const font = LocalFont({ src: "../assets/fonts/red-alert-lan.ttf" });

export const metadata = {
  title: "Tosser - #1 Most Trusted Place to Flip",
  description: "Tosser - #1 Most Trusted Place to Flip",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WalletContextProvider>
        <html lang="en">
          <body className={font.className}>
            <Toaster />
            {children}
          </body>
        </html>
      </WalletContextProvider>
    </>
  );
}
