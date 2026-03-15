import { ClientOnly } from "@/components/client-only";
import { ZodConfig } from "@/components/zod-config";
import { I18nProviderClient } from "@/locales/client";
import { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { SWRConfig } from "swr";
import "./globals.css";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "",
  description: "",
};

// import { Geist } from "next/font/google";
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// import { getStaticParams } from "@/locales/server";
// export function generateStaticParams() {
//   return getStaticParams();
// }

export default async function Layout(props: LayoutProps<"/[locale]">) {
  const { locale } = await props.params;

  return (
    <>
      <html lang={locale} className="[--brand-text-1:#0a0a0a]">
        <body className="text-(--brand-text-1)">
          <I18nProviderClient locale={locale}>
            <NuqsAdapter defaultOptions={{}}>
              <SWRConfig value={{}}>
                <ClientOnly>
                  <ZodConfig></ZodConfig>
                  {props.children}
                </ClientOnly>
              </SWRConfig>
            </NuqsAdapter>
          </I18nProviderClient>
        </body>
      </html>
    </>
  );
}
