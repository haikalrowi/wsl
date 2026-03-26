"use client";

import { useQuery, useStore } from "@/hooks/use-state-app";
import { useChangeLocale, useCurrentLocale, useI18n } from "@/locales/client";
import { appDefaultApi, appSchema, petstorePetApi } from "@/openapi";
import { env } from "@/utils/env";
import { zodResolver } from "@hookform/resolvers/zod";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { colorful } from "@versatiles/style";
import { wrap } from "comlink";
import { m } from "motion/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { Controller, useForm, Watch } from "react-hook-form";
import {
  FullscreenControl,
  GeolocateControl,
  LogoControl,
  Map,
  Marker,
  NavigationControl,
  Popup,
  ScaleControl,
} from "react-map-gl/maplibre";
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
      <div className="[&,&_*]:not-[[data-isolate],[data-isolate]_*]:m-auto [&,&_*]:not-[[data-isolate],[data-isolate]_*]:flex [&,&_*]:not-[[data-isolate],[data-isolate]_*]:gap-1 [&,&_*]:not-[[data-isolate],[data-isolate]_*]:p-px [&,&_*]:not-[[data-isolate],[data-isolate]_*]:not-data-flex-row:flex-col [&,&_*]:not-[[data-isolate],[data-isolate]_*]:[button]:[all:revert] [&,&_*]:not-[[data-isolate],[data-isolate]_*]:[input,select,textarea]:border">
        <PandoraBox></PandoraBox>
        <Env></Env>
        <Internationalization></Internationalization>
        <Store></Store>
        <Swr></Swr>
        <Form></Form>
        <WebWorkers></WebWorkers>
        <Lottie></Lottie>
        <Print></Print>
        <GoogleMapsEmbed></GoogleMapsEmbed>
        <MapLibre></MapLibre>
        <YoutubeEmbed></YoutubeEmbed>
        <Motion></Motion>
      </div>
    </>
  );
}

const PandoraBox = dynamic(
  async () => {
    const packageJson = fetch(new URL("@/package.json", import.meta.url));

    return function PandoraBox() {
      console.log(PandoraBox.name);

      const packageJsonResponse = use(packageJson);
      console.log(packageJsonResponse.status);

      return <></>;
    };
  },
  { ssr: false },
);

function Env() {
  console.log(Env.name);

  return <pre>{JSON.stringify(env, null, 2)}</pre>;
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
          {"isAdult"}
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
    values: formPersist.getInitialState(),
    // values: formPersist.getState(),
    resolver: zodResolver(formSchema),
  });

  return (
    <form onSubmit={form.handleSubmit(console.log)}>
      {/* <Watch
        control={form.control}
        compute={formPersist.setState}
        render={() => <></>}
      ></Watch> */}
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
            form.reset(formPersist.getInitialState());
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
    <div data-isolate className="relative m-auto aspect-square h-64 border">
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

function Print() {
  console.log(Print.name);

  return (
    <>
      <style jsx global>{`
        @media print {
          @page {
            size: 8.5in calc(11in * 1);
            margin: 0;
          }
          :not(:has([data-print]), [data-print], [data-print] *) {
            display: none;
          }
          html,
          body {
            margin: 0.1in;
          }
          * {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
      <div>
        <button
          onClick={() => {
            window.print();
          }}
        >
          {"print"}
        </button>
      </div>
      <div
        data-isolate
        data-print
        className="typography relative m-auto not-print:hidden"
      >
        <h1>Styling the Web: A Modern CSS Journey</h1>
        <p>
          CSS has come a long way since its inception. From simple layout tweaks
          to complex responsive designs, it&apos;s become an essential tool for
          crafting delightful web experiences. In this article, we&apos;ll
          explore various HTML elements commonly styled with modern CSS utility
          systems like <code>tailwindcss</code>
          and component libraries.
        </p>
        <h2>Introduction</h2>
        <p>
          Web design today is more accessible than ever. Thanks to utility-first
          frameworks and component-based architectures, developers can build
          beautiful UIs with less effort.
        </p>
        <h3>Key Benefits of Utility CSS</h3>
        <ul>
          <li>Faster development</li>
          <li>Consistent design system</li>
          <li>Better collaboration between dev and design</li>
        </ul>
        <h3>What You Need</h3>
        <ol>
          <li>Basic HTML/CSS knowledge</li>
          <li>Code editor (e.g., VS Code)</li>
          <li>Modern browser for testing</li>
        </ol>
        <h2>Checklist</h2>
        <ul>
          <li>
            <input checked disabled type="checkbox" />{" "}
            <p>Install Tailwind CSS</p>
          </li>
          <li>
            <input disabled type="checkbox" /> <p>Configure PostCSS</p>
          </li>
          <li>
            <input disabled type="checkbox" /> <p>Create base components</p>
          </li>
        </ul>
        <h2>Sample Image</h2>
        <p>
          Here&apos;s a sample image to test image styling. Make sure it scales
          well on all screen sizes.
        </p>
        <center>
          <Image
            alt="Cute kitten"
            height={400}
            src="https://placehold.co/600x400"
            unoptimized
            width={600}
          />
        </center>
        <h2>Code Example</h2>
        <pre>
          <code>{`/* Tailwind example */
.button {
  @apply px-4 py-2 bg-blue-600 text-white rounded;
}`}</code>
        </pre>
        <h2>Blockquote</h2>
        <blockquote>
          &quot;Design is not just what it looks like and feels like. Design is
          how it works.&quot; — Steve Jobs
        </blockquote>
        <h2>Table Example</h2>
        <table>
          <thead>
            <tr>
              <th>Framework</th>
              <th>Type</th>
              <th>Stars</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Tailwind CSS</td>
              <td>Utility-First</td>
              <td>70k+</td>
            </tr>
            <tr>
              <td>Bootstrap</td>
              <td>Component-Based</td>
              <td>160k+</td>
            </tr>
            <tr>
              <td>Bulma</td>
              <td>Utility/Component Hybrid</td>
              <td>45k+</td>
            </tr>
          </tbody>
        </table>
        <h2>Inline Elements</h2>
        <p>
          You can <strong>bold</strong> text, <em>italicize</em> it,{" "}
          <u>underline</u> it, or even add{" "}
          <a href="https://example.com">links</a>. Here&apos;s some{" "}
          <code>inline code</code> too.
        </p>
        <h2>Definition List</h2>
        <dl>
          <dt>CSS</dt>
          <dd>Cascading Style Sheets</dd>
          <dt>HTML</dt>
          <dd>HyperText Markup Language</dd>
          <dt>JS</dt>
          <dd>JavaScript</dd>
        </dl>
        <h2>Details and Summary</h2>
        <details>
          <summary>Click to expand additional info</summary>
          <p>
            Utility CSS simplifies the process of managing and scaling CSS in
            large projects.
          </p>
        </details>
        <h2>Inline Elements</h2>
        <p>
          You can <strong>bold</strong> text, <em>italicize</em> it,{" "}
          <u>underline</u> it, or even add{" "}
          <a href="https://example.com">links</a>. Here&apos;s some{" "}
          <code>inline code</code> too. <mark>Highlight important info</mark>{" "}
          and <small>small text size</small>.{" "}
          <abbr title="HyperText Markup Language">HTML</abbr> is the foundation
          of the web.
        </p>
        <h2>Superscript & Subscript</h2>
        <p>
          E = mc<sup>2</sup> is Einstein&apos;s mass-energy equivalence. Water
          is H<sub>2</sub>O.
        </p>
        <h2>Conclusion</h2>
        <p>
          Whether you&apos;re using Tailwind, vanilla CSS, or any other system,
          a solid understanding of how HTML elements behave is key to great
          styling. Test extensively to ensure consistent, accessible results
          across devices.
        </p>
      </div>
    </>
  );
}

function GoogleMapsEmbed() {
  console.log(GoogleMapsEmbed.name);

  return (
    <div data-isolate className="relative m-auto aspect-video h-64 border">
      <iframe
        src="https://maps.google.com/maps?output=embed&q=australia"
        className="absolute inset-0 h-full w-full"
      ></iframe>
    </div>
  );
}

function MapLibre() {
  console.log(MapLibre.name);

  const [popup, setPopup] = useState(
    null as null | { longitude: number; latitude: number; description: string },
  );

  return (
    <div data-isolate className="relative m-auto aspect-video h-64 border">
      <Map
        // mapStyle="https://tiles.openfreemap.org/styles/liberty"
        mapStyle={colorful({ baseUrl: "https://tiles.versatiles.org" })}
        cooperativeGestures
      >
        <Marker
          longitude={0}
          latitude={0}
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            setPopup({
              longitude: e.target.getLngLat().lng,
              latitude: e.target.getLngLat().lat,
              description: "popup",
            });
          }}
        >
          <div className="size-4 cursor-pointer rounded-full bg-red-500"></div>
        </Marker>
        {popup && (
          <Popup
            longitude={popup.longitude}
            latitude={popup.latitude}
            onClose={() => {
              setPopup(null);
            }}
          >
            <p>{popup.description}</p>
          </Popup>
        )}
        <FullscreenControl></FullscreenControl>
        <GeolocateControl></GeolocateControl>
        <NavigationControl></NavigationControl>
        <ScaleControl></ScaleControl>
        {/* <TerrainControl source=""></TerrainControl> */}
        <LogoControl></LogoControl>
      </Map>
    </div>
  );
}

function YoutubeEmbed() {
  console.log(YoutubeEmbed.name);

  const videoId = "xdKay6bhIMg";

  return (
    <div
      data-isolate
      className="relative m-auto aspect-video h-64 overflow-hidden border"
    >
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&mute=1&controls=0&playlist=${videoId}&rel=0`}
        loading="lazy"
        className="pointer-events-none absolute inset-0 -ml-[450%] h-full w-[1000%]"
      ></iframe>
    </div>
  );
}

function Motion() {
  console.log(Motion.name);

  return (
    <m.div
      animate={{
        "--rounded": [
          "0px",
          "64px",
          null,
          "0px",
          "64px",
          null,
          "0px",
          "64px",
          null,
          "0px",
          "64px",
          null,
          "0px",
        ],
        "--rotate": [
          "0deg",
          null,
          "90deg",
          null,
          null,
          "180deg",
          null,
          null,
          "270deg",
          null,
          null,
          "360deg",
          null,
        ],
      }}
      transition={{ duration: 7, repeat: Infinity }}
      data-isolate
      className="relative m-auto aspect-square h-64 scale-[70%] rotate-(--rotate) rounded-(--rounded) border"
    >
      <Image
        src="https://www.google.com/s2/favicons?sz=256&domain=motion.dev"
        alt=""
        unoptimized
        fill
        className="rounded-(--rounded) object-contain"
      ></Image>
    </m.div>
  );
}
