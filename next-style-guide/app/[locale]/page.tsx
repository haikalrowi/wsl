"use client";

import { useConfig } from "@/hooks/use-config";
import { useDataApp } from "@/hooks/use-data-app";
import { useMutationApp } from "@/hooks/use-mutation-app";
import { useNavigation } from "@/hooks/use-navigation";
import { useStoreApp } from "@/hooks/use-store-app";

function Component() {
  const { t, locale, changeLocale } = useConfig();
  const { pathname, params: params, router } = useNavigation();
  const { searchParams, store } = useStoreApp();
  const { data, isValidating, mutate } = useDataApp();
  const { trigger, isMutating, data: data2 } = useMutationApp();

  return (
    <div>
      {/*  */}
      <div>
        <p></p>
        <ul>
          <li></li>
        </ul>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <div>
      {/*  */}
      <div>
        <p></p>
        <ul>
          <li></li>
        </ul>
      </div>
    </div>
  );
}
