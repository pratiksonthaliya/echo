import "@/styles/globals.css";
import type { AppProps } from "next/app";
import localFont from "next/font/local";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from "react-hot-toast";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function App({ Component, pageProps }: AppProps) {
  return <GoogleOAuthProvider clientId="884345547859-4ehmqdt1je88b3krt62i1s2ncmicar9m.apps.googleusercontent.com">
    <div className={`${geistSans.variable} ${geistMono.variable} font-[family-name:var(--font-geist-sans)]`}>
      <Component {...pageProps} />
      <Toaster />
    </div>
  </GoogleOAuthProvider>
}
