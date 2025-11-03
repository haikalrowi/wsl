"use client";

import { useConfig } from "@/hooks/use-config";
import { useNavigation } from "@/hooks/use-navigation";
import { useStoreApp } from "@/hooks/use-store-app";
import { reposOwnerRepoSchema } from "@/lib/data-schemas";
import { openapi } from "@/openapi";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

function Component() {
  const { t, locale, changeLocale } = useConfig();
  const { pathname, params, router } = useNavigation();
  const { searchParams, store } = useStoreApp();
  const { data, isValidating, mutate } = useSWR(
    openapi.app.getSWRKey("get:/repos/{owner}/{repo}", {
      owner: "vercel",
      repo: "swr",
    }),
    (key) =>
      openapi.app.api
        .reposOwnerRepoGet(key.arg)
        .then(reposOwnerRepoSchema.parse)
        .then(openapi.app.getResponseData)
        .catch(openapi.app.getResponseError),
  );
  const {
    trigger,
    isMutating,
    data: data2,
  } = useSWRMutation(
    openapi.app.getSWRKey("get:/repos/{owner}/{repo}", {}),
    (_, { arg }: { arg: { owner: string; repo: string } }) =>
      openapi.app.api
        .reposOwnerRepoGet({ ...arg })
        .then(reposOwnerRepoSchema.parse)
        .then(openapi.app.getResponseData)
        .catch(openapi.app.getResponseError),
  );

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
