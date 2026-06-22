import { Csr } from "@/components/csr";
import { LazyMotion } from "@/components/lazy-motion";
import { ZodConfig } from "@/components/zod-config";
import { I18nProviderClient } from "@/locales/client";
import { getStaticParams } from "@/locales/server";
import { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { SWRConfig } from "swr";
import "./globals.css";

export const metadata: Metadata = {
  title: "",
  description: "",
};

export async function generateStaticParams() {
  return getStaticParams();
}

// import { cacheLife } from "next/cache";
// "use cache";
// cacheLife("max");

// import { Geist } from "next/font/google";
// const geist = Geist({
//   variable: "--font-geist",
//   subsets: ["latin"],
// });

export default async function Layout(props: LayoutProps<"/[locale]">) {
  const params = await props.params;

  return (
    <>
      <html lang={params.locale} className="[--brand-black:#0a0a0a]">
        <body className="text-(--brand-black)">
          <ZodConfig></ZodConfig>
          <I18nProviderClient locale={params.locale}>
            <NuqsAdapter defaultOptions={{}}>
              <SWRConfig value={{}}>
                <LazyMotion>
                  <Csr>{props.children}</Csr>
                </LazyMotion>
              </SWRConfig>
            </NuqsAdapter>
          </I18nProviderClient>
        </body>
      </html>
    </>
  );
}
