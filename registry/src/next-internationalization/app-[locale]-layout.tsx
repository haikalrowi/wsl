import { I18nProviderClient } from "@/locales/client";
import { getStaticParams } from "@/locales/server";

export async function generateStaticParams() {
  return getStaticParams();
}

export default async function Layout(props: LayoutProps<"/[locale]">) {
  const params = await props.params;

  return (
    <>
      <I18nProviderClient locale={params.locale}>
        {props.children}
      </I18nProviderClient>
    </>
  );
}
