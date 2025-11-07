"use client";

import { useConfig } from "@/hooks/use-config";
import { useData } from "@/hooks/use-data";
import { useMutation } from "@/hooks/use-mutation";
import { useNavigation } from "@/hooks/use-navigation";
import { useStoreApp } from "@/hooks/use-store-app";
import { reposOwnerRepoSchema } from "@/lib/data-schemas";
import { openapi } from "@/openapi";

function Component() {
  const { t, locale, changeLocale } = useConfig();
  const { pathname, params, router } = useNavigation();
  const { searchParams, store } = useStoreApp();
  const { data: dataRepo, isValidating } = useData(
    openapi.app.defaultApi,
    openapi.app.defaultApi.reposOwnerRepoGet,
    [{ owner: "vercel", repo: "swr" }],
    reposOwnerRepoSchema.parse,
  );
  const {
    data: dataPet,
    isMutating,
    trigger,
  } = useMutation(openapi.petstore.petApi, openapi.petstore.petApi.getPetById, [
    { petId: 1 },
  ]);

  return (
    <div className="[&_button]:[all:revert]">
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
      {/* <Component /> */}
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
