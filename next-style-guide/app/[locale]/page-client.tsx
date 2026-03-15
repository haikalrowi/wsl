"use client";

import { useQuery, useStore } from "@/hooks/use-state-app";
import { useChangeLocale, useCurrentLocale, useI18n } from "@/locales/client";
import { appDefaultApi, appSchema, petstorePetApi } from "@/openapi";
import { zodResolver } from "@hookform/resolvers/zod";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { wrap } from "comlink";
import { useRouter } from "next/navigation";
import { Controller, useForm, Watch } from "react-hook-form";
import useSWRImmutable from "swr/immutable";
import useSWRMutation from "swr/mutation";
import z from "zod";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { WorkerApi } from "./worker";

export function PageClient() {
  console.log(PageClient.name);

  return (
    <>
      <div className="[&_button]:[all:revert] [&_input,select,textarea]:border [&,&_*:not([data-isolate],[data-isolate]_*)]:m-auto [&,&_*:not([data-isolate],[data-isolate]_*)]:flex [&,&_*:not([data-isolate],[data-isolate]_*)]:gap-1 [&,&_*:not([data-isolate],[data-isolate]_*)]:not-data-flex-row:flex-col">
        <Internationalization></Internationalization>
        <Store></Store>
        <Swr></Swr>
        <Form></Form>
        <WebWorkers></WebWorkers>
        <Lottie></Lottie>
      </div>
    </>
  );
}

function Internationalization() {
  console.log(Internationalization.name);

  const t = useI18n();
  const currentLocale = useCurrentLocale();
  const changeLocale = useChangeLocale();
  const router = useRouter();

  return (
    <div>
      <p>{t("hello")}</p>
      <div data-flex-row>
        <button
          onClick={() => {
            changeLocale(({ en: "ja", ja: "en" } as const)[currentLocale]);
          }}
        >
          {"changeLocale(...);"}
        </button>
        <button
          onClick={() => {
            router.push("/");
          }}
        >
          {'router.push("/");'}
        </button>
      </div>
    </div>
  );
}

function Store() {
  console.log(Store.name);

  const [query, setQuery] = useQuery();
  const store = useStore();

  return (
    <div>
      <div>
        <input
          value={query.name}
          onChange={(e) => {
            setQuery({ name: e.currentTarget.value });
          }}
        />
        <input value={query.age} readOnly />
        <div data-flex-row>
          <button
            onClick={() => {
              setQuery((s) => ({ age: s.age - 1 }));
            }}
          >
            {"age-1"}
          </button>
          <button
            onClick={() => {
              setQuery((s) => ({ age: s.age + 1 }));
            }}
          >
            {"age+1"}
          </button>
        </div>
        <label data-flex-row>
          <input
            type="checkbox"
            checked={query.isAdult}
            onChange={(e) => {
              setQuery({ isAdult: e.currentTarget.checked });
            }}
          />
          <span>{"isAdult"}</span>
        </label>
      </div>
      <div>
        <input
          value={store.id}
          onChange={(e) => {
            useStore.setState({ id: e.currentTarget.value });
          }}
        />
        <input
          type="number"
          value={store.count}
          onChange={(e) => {
            useStore.setState({
              count: e.currentTarget.valueAsNumber || 0,
            });
          }}
        />
        <select
          value={`${store.isActive}`}
          onChange={(e) => {
            useStore.setState({
              isActive: { true: true, false: false }[e.currentTarget.value],
            });
          }}
        >
          <option value="false">{"isActive:false"}</option>
          <option value="true">{"isActive:true"}</option>
        </select>
      </div>
    </div>
  );
}

function Swr() {
  console.log(Swr.name);

  const repo = useSWRImmutable(
    [
      appDefaultApi.reposOwnerRepoGet,
      { owner: "vercel", repo: "swr" },
      // { headers: { Authorization: "Authorization" } },
    ],
    async ([, ...params]) => {
      const data = await appDefaultApi.reposOwnerRepoGet(...params);
      return appSchema.reposOwnerRepoGet.parse(data);
    },
  );
  const pet = useSWRMutation(
    [petstorePetApi.getPetById, { petId: 1 }],
    ([, ...params], { arg }: { arg?: typeof params }) => {
      return petstorePetApi.getPetById(...(arg || params));
    },
  );

  return (
    <div data-flex-row>
      <button
        onClick={() => {
          repo.mutate();
        }}
      >
        {"repo.mutate();"}
      </button>
      <button
        onClick={() => {
          pet.trigger([{ petId: 2 }]);
        }}
      >
        {"pet.trigger(...);"}
      </button>
    </div>
  );
}

const formSchema = z.object({
  title: z.string().nonempty().default(""),
  description: z.string().nonempty().default(""),
});
const formPersist = create(
  persist(() => formSchema.parse({}), { name: "form-persist" }),
);

function Form() {
  console.log(Form.name);

  const form = useForm({
    defaultValues: formSchema.parse({}),
    values: formPersist.getState(),
    resolver: zodResolver(formSchema),
  });

  return (
    <form onSubmit={form.handleSubmit(console.log)}>
      <Watch
        compute={formPersist.setState}
        control={form.control}
        render={() => <></>}
      ></Watch>
      <Controller
        name="title"
        control={form.control}
        render={({ field }) => <input {...field} placeholder={field.name} />}
      ></Controller>
      <Watch
        name="title"
        control={form.control}
        render={(field) => <p>{`title: ${field}`}</p>}
      ></Watch>
      <Controller
        name="description"
        control={form.control}
        render={({ field }) => <textarea {...field} placeholder={field.name} />}
      ></Controller>
      <Watch
        name={["description"]}
        control={form.control}
        render={(field) => <p>{`description: ${field[0]}`}</p>}
      ></Watch>
      <div data-flex-row>
        <button type="submit" disabled={!form.formState.isValid}>
          {"submit"}
        </button>
        <button
          type="reset"
          onClick={() => {
            form.reset(formSchema.parse({}));
          }}
        >
          {"reset"}
        </button>
      </div>
    </form>
  );
}

function WebWorkers() {
  console.log(WebWorkers.name);

  useSWRImmutable([WebWorkers], async () => {
    const worker = new Worker(new URL("./worker.ts", import.meta.url));
    const workerApi = wrap<WorkerApi>(worker);
    // const worker = new SharedWorker(new URL("./worker.ts", import.meta.url));
    // const workerApi = wrap<WorkerApi>(worker.port);
    console.log(await workerApi.getDateNow());
  });

  return <></>;
}

function Lottie() {
  console.log(Lottie.name);

  return (
    <div data-isolate className="m-auto size-96 border">
      <DotLottieReact
        src={new URL("./VrgZppaPQ8.json", import.meta.url).href}
        // src={new URL("./VrgZppaPQ8.lottie", import.meta.url).href}
        autoplay
        layout={{ fit: "cover" }}
        loop
        renderConfig={{ autoResize: true }}
      ></DotLottieReact>
    </div>
  );
}
