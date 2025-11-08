"use client";

import { useConfig } from "@/hooks/use-config";
import { useDataImmutable } from "@/hooks/use-data";
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
      className="mx-auto flex w-96 flex-col p-2 [&_button,input,textarea]:[all:revert]"
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
          <button type="submit" disabled={fields.some((item) => !item)}>
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
  const dataRepo = useDataImmutable([
    openapi.app.defaultApi,
    openapi.app.defaultApi.reposOwnerRepoGet,
    [{ owner: "vercel", repo: "swr" }],
    reposOwnerRepoSchema.parse,
  ]);
  const dataPet = useMutation([
    openapi.petstore.petApi,
    openapi.petstore.petApi.getPetById,
    [{ petId: 1 }],
  ]);

  {
    {
      console.log(1);
    }
  }

  return (
    <div className="mx-auto w-96 p-2 [&_button,input]:[all:revert]">
      {/*  */}
      <div>
        <p>{t("hello")}</p>
        <button
          onClick={() => {
            changeLocale(({ en: "ja", ja: "en" } as const)[locale]);
          }}
        >
          {"changeLocale(...);"}
        </button>
      </div>
      {/*  */}
      <div>
        <button
          onClick={() => {
            router.push("/");
          }}
        >
          {'router.push("/");'}
        </button>
      </div>
      {/*  */}
      <div>
        <input
          value={searchParams.name}
          onChange={(e) => {
            searchParams.set({ name: e.target.value });
          }}
        />
        <button
          onClick={() => {
            searchParams.set((s) => ({ age: s.age + 1 }));
          }}
        >
          {"age+1"}
        </button>
        <button
          onClick={() => {
            searchParams.set((s) => ({ isAdult: !s.isAdult }));
          }}
        >
          {"!s.isAdult"}
        </button>
      </div>
      {/*  */}
      <div>
        <input
          value={store.id}
          onChange={(e) => {
            store.set({ id: e.target.value });
          }}
        />
        <button
          onClick={() => {
            store.set((s) => ({ count: s.count + 1 }));
          }}
        >
          {"count+1"}
        </button>
        <button
          onClick={() => {
            store.set((s) => ({ isActive: !s.isActive }));
          }}
        >
          {"!s.isActive"}
        </button>
      </div>
      {/*  */}
      <div>
        <button
          onClick={() => {
            dataRepo.mutate();
          }}
        >
          {"dataRepo.mutate();"}
        </button>
      </div>
      {/*  */}
      <div>
        <button
          onClick={() => {
            dataPet.trigger();
          }}
        >
          {"dataPet.trigger();"}
        </button>
      </div>
    </div>
  );
}
