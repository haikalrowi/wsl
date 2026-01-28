"use client";

import { useQuery, useStore } from "@/hooks/use-state-app";
import { useChangeLocale, useCurrentLocale, useI18n } from "@/locales/client";
import { openapi } from "@/openapi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
  const t = useI18n();
  const currentLocale = useCurrentLocale();
  const changeLocale = useChangeLocale();
  const router = useRouter();
  const [query, setQuery] = useQuery();
  const store = useStore();
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
    <>
      <div className="mx-auto max-w-xs **:flex **:flex-col **:gap-1 [&_button]:[all:revert] [&_input,select,textarea]:border">
        <div>
          {/*  */}
          <div>
            <p>{t("hello")}</p>
            <button
              onClick={() => {
                changeLocale(({ en: "ja", ja: "en" } as const)[currentLocale]);
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
              value={query.name}
              onChange={(e) => {
                setQuery({ name: e.target.value });
              }}
            />
            <div>
              <input value={query.age} readOnly />
              <button
                onClick={() => {
                  setQuery((s) => ({ age: s.age + 1 }));
                }}
              >
                {"age+1"}
              </button>
            </div>
            <select
              value={`${query.isAdult}`}
              onChange={(e) => {
                setQuery({ isAdult: JSON.parse(e.target.value) });
              }}
            >
              <option value="false">{"isAdult:false"}</option>
              <option value="true">{"isAdult:true"}</option>
            </select>
          </div>

          {/*  */}
          <div>
            <input
              value={store.id}
              onChange={(e) => {
                store.set({ id: e.target.value });
              }}
            />
            <div>
              <input value={store.count} readOnly />
              <button
                onClick={() => {
                  store.set((s) => ({ count: s.count + 1 }));
                }}
              >
                {"count+1"}
              </button>
            </div>
            <select
              value={`${store.isActive}`}
              onChange={(e) => {
                store.set({ isActive: JSON.parse(e.target.value) });
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
        </div>
      </div>
    </>
  );
}
