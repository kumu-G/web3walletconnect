import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

import { cookieToInitialState } from "wagmi";

import { config } from "@/config";
import Web3ModalProvider from "@/context";
import ConnectButton from "./ConnectButton";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(config, headers().get("cookie"));
  return (
    <html lang="en">
      <body>
        <Web3ModalProvider initialState={initialState}>
          <div className="absolute top-0 right-0 p-4">
            <ConnectButton />
          </div>
          {children}
        </Web3ModalProvider>
      </body>
    </html>
  );
}