import { I18nProviderClient } from "@/locales/client";
import { Metadata } from "next";
import "./globals.css";

// import { Geist } from "next/font/google";
// const geistSans = Geist({
//   variable: "--font-geist",
//   subsets: ["latin"],
// });

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "",
  description: "",
};

export default async function Layout({
  params,
  children,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;

  return (
    <html lang={locale}>
      <body>
        <I18nProviderClient locale={locale}>{children}</I18nProviderClient>
      </body>
    </html>
  );
}
