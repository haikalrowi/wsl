import { Metadata } from "next";
import "./globals.css";

// import { Geist } from "next/font/google";
// const geistSans = Geist({
//   variable: "--font-geist",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "",
  description: "",
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
