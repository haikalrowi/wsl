import { ClientOnly } from "@/components/client-only";
import { I18nProviderClient } from "@/locales/client";
import { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { SWRConfig } from "swr";
import "./globals.css";

// import { Geist } from "next/font/google";
// const geistSans = Geist({
//   variable: "--font-geist",
//   subsets: ["latin"],
// });

export const dynamic = "force-static";

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
    <>
      <html lang={locale} className="[--brand-text-1:#0a0a0a]">
        <body className="text-(--brand-text-1)">
          <I18nProviderClient locale={locale}>
            <NuqsAdapter defaultOptions={{}}>
              <SWRConfig value={{}}>
                <ClientOnly>{children}</ClientOnly>
              </SWRConfig>
            </NuqsAdapter>
          </I18nProviderClient>
        </body>
      </html>
    </>
  );
}
