"use client";

import { useConfig } from "@/hooks/use-config";
import { useData } from "@/hooks/use-data";
import { useMutation } from "@/hooks/use-mutation";
import { useNavigation } from "@/hooks/use-navigation";
import { useStoreApp } from "@/hooks/use-store-app";
import { reposOwnerRepoSchema } from "@/lib/data-schemas";
import { openapi } from "@/openapi";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, Watch } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export function Form() {
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
    resolver: zodResolver(formSchema),
  });

  return (
    <form
      className="mx-auto flex w-64 flex-col [&_button]:[all:revert]"
      onSubmit={form.handleSubmit(console.log)}
    >
      <Controller
        name="title"
        control={form.control}
        render={({ field }) => <input {...field} placeholder={field.name} />}
      ></Controller>
      <Controller
        name="description"
        control={form.control}
        render={({ field }) => <textarea {...field} placeholder={field.name} />}
      ></Controller>
      <Watch
        names={["title", "description"]}
        control={form.control}
        render={(fields) => (
          <button type="submit" disabled={!fields[0] || !fields[1]}>
            submit
          </button>
        )}
      ></Watch>
    </form>
  );
}

export function PageClient() {
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
