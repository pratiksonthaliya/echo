import "@/styles/globals.css";
import type { AppProps } from "next/app";
import localFont from "next/font/local";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
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

const queryClient = new QueryClient(); 

export default function App({ Component, pageProps }: AppProps) {
  return (
  <div className={`${geistSans.variable} ${geistMono.variable} font-[family-name:var(--font-geist-sans)]`}>
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId="884345547859-4ehmqdt1je88b3krt62i1s2ncmicar9m.apps.googleusercontent.com">
          <Component {...pageProps} />
          <Toaster />
          <ReactQueryDevtools />
      </GoogleOAuthProvider>
    </QueryClientProvider>
  </div>
  )
}
