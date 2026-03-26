import { ClientOnly } from "@/components/client-only";
import { LazyMotion } from "@/components/lazy-motion";
import { ZodConfig } from "@/components/zod-config";
import { I18nProviderClient } from "@/locales/client";
import "maplibre-gl/dist/maplibre-gl.css";
import { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { SWRConfig } from "swr";
import "./globals.css";
import "./shadcn.css";
import "./typography.css";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "",
  description: "",
};

// import { Geist } from "next/font/google";
// const geist = Geist({
//   variable: "--font-geist",
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
                <LazyMotion>
                  <ClientOnly>
                    <ZodConfig></ZodConfig>
                    {props.children}
                  </ClientOnly>
                </LazyMotion>
              </SWRConfig>
            </NuqsAdapter>
          </I18nProviderClient>
        </body>
      </html>
    </>
  );
}
