"use client";

import { useConfig } from "@/hooks/use-config";
import { useNavigation } from "@/hooks/use-navigation";
import { useStore as useStoreApp } from "@/hooks/use-store-app";
import { openapi } from "@/openapi";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, Watch } from "react-hook-form";
import useSWRImmutable from "swr/immutable";
import useSWRMutation from "swr/mutation";
import * as z from "zod";

const formSchema = z.object({
  title: z.string(),
  description: z.string(),
});

function Form() {
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
    values: {
      title: "",
      description: "",
    },
    resolver: zodResolver(formSchema),
  });

  return (
    <form onSubmit={form.handleSubmit(console.log)}>
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
  const storeApp = useStoreApp();
  const dataRepo = useSWRImmutable(
    {
      this: openapi.app.defaultApi,
      fetch: openapi.app.defaultApi.reposOwnerRepoGet,
      arg: { owner: "vercel", repo: "swr" },
      parse: openapi.app.schema.reposOwnerRepoGet.parse,
    },
    (x) => {
      return x.fetch.bind(x.this)(x.arg).then(x.parse);
    },
  );
  const dataPet = useSWRMutation(
    {
      this: openapi.petstore.petApi,
      fetch: openapi.petstore.petApi.getPetById,
      arg: { petId: 1 },
    },
    (x, y: { arg?: typeof x.arg }) => {
      return x.fetch.bind(x.this)(y.arg || x.arg);
    },
  );

  {
    {
      console.log(1);
    }
  }

  return (
    <section>
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
          value={storeApp.searchParams.name}
          onChange={(e) => {
            storeApp.searchParams.set({ name: e.target.value });
          }}
        />
        <div>
          <input value={storeApp.searchParams.age} readOnly />
          <button
            onClick={() => {
              storeApp.searchParams.set((s) => ({ age: s.age + 1 }));
            }}
          >
            {"age+1"}
          </button>
        </div>
        <select
          value={`${storeApp.searchParams.isAdult}`}
          onChange={(e) => {
            storeApp.searchParams.set({ isAdult: JSON.parse(e.target.value) });
          }}
        >
          <option value="false">{"isAdult:false"}</option>
          <option value="true">{"isAdult:true"}</option>
        </select>
      </div>
      {/*  */}
      <div>
        <input
          value={storeApp.id}
          onChange={(e) => {
            storeApp.set({ id: e.target.value });
          }}
        />
        <div>
          <input value={storeApp.count} readOnly />
          <button
            onClick={() => {
              storeApp.set((s) => ({ count: s.count + 1 }));
            }}
          >
            {"count+1"}
          </button>
        </div>
        <select
          value={`${storeApp.isActive}`}
          onChange={(e) => {
            storeApp.set({ isActive: JSON.parse(e.target.value) });
          }}
        >
          <option value="false">{"isActive:false"}</option>
          <option value="true">{"isActive:true"}</option>
        </select>
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
            dataPet.trigger({ petId: 2 });
          }}
        >
          {"dataPet.trigger(...);"}
        </button>
      </div>
      {/*  */}
      <Form />
    </section>
  );
}
