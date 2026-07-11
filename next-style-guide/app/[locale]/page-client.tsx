"use client";

import { Api } from "@/assets/worker";
import { GoogleChart } from "@/components/google-chart";
import { Link } from "@/components/link";
import { useQuery, useStore } from "@/hooks/use-state-app";
import { useChangeLocale, useCurrentLocale, useI18n } from "@/locales/client";
import { appDefaultApi, appSchema, petstorePetApi } from "@/openapi";
import { env } from "@/utils/env";
import { zodResolver } from "@hookform/resolvers/zod";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { usePagination } from "@mantine/hooks";
import { colorful } from "@versatiles/style";
import { wrap } from "comlink";
import { m } from "motion/react";
import Image from "next/image";
import { createSerializer, parseAsStringLiteral, useQueryStates } from "nuqs";
import { encodeQR } from "qr";
import { frameLoop, frontalCamera, QRCanvas } from "qr/dom.js";
import { useRef, useState } from "react";
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
import { getEnv } from "./page-server";

export function PageClient() {
  const [query] = useGuide();
  const Guide = guide[query.guide as keyof typeof guide];

  return (
    <div className="utils flex-row">
      <div className="flex-1 overflow-y-scroll">
        {guideKeys.map((item) => (
          <Link
            key={item}
            href={serializeGuide("/", { guide: item })}
            data-active={item === query.guide}
            className="hover:ring data-[active=true]:ring"
          >
            {item}
          </Link>
        ))}
      </div>
      <div className="flex-2 overflow-y-scroll">
        <p>{query.guide}</p>
        <Guide></Guide>
      </div>
    </div>
  );
}

const guide = {
  // https://nextjs.org/docs/app/guides/environment-variables
  Env() {
    console.log(guide.Env.name);

    const data = useSWRImmutable([guide.Env], async () => {
      return getEnv();
    });

    return (
      <>
        <textarea
          rows={10}
          value={JSON.stringify(env, null, 2)}
          readOnly
        ></textarea>
        <textarea
          rows={10}
          value={JSON.stringify(data.data, null, 2)}
          readOnly
        ></textarea>
      </>
    );
  },

  // https://github.com/QuiiBz/next-international
  Internationalization() {
    console.log(guide.Internationalization.name);

    const t = useI18n();
    const currentLocale = useCurrentLocale();
    const changeLocale = useChangeLocale({ preserveSearchParams: true });

    return (
      <>
        <input value={t("hello.world")} readOnly />
        <button
          onClick={() => {
            changeLocale(currentLocale === "en" ? "ja" : "en");
          }}
        >
          {"⇄"}
        </button>
      </>
    );
  },

  // https://github.com/47ng/nuqs
  Query() {
    console.log(guide.Query.name);

    const [query, setQuery] = useQuery();

    return (
      <>
        <div className="flex-row">
          <label className="flex-row">
            <input
              type="checkbox"
              checked={query.isAdult}
              onChange={(e) => {
                setQuery({ isAdult: e.currentTarget.checked });
              }}
            />
            {"isAdult"}
          </label>
          <input
            value={query.name}
            onChange={(e) => {
              setQuery({ name: e.currentTarget.value });
            }}
          />
          <input value={query.age} readOnly />
          <button
            onClick={() => {
              setQuery((s) => ({ age: s.age - 1 }));
            }}
          >
            {"-"}
          </button>
          <button
            onClick={() => {
              setQuery((s) => ({ age: s.age + 1 }));
            }}
          >
            {"+"}
          </button>
        </div>
        <button
          onClick={() => {
            setQuery(null);
          }}
        >
          {"↻"}
        </button>
      </>
    );
  },

  // https://github.com/pmndrs/zustand
  Store() {
    console.log(guide.Store.name);

    const store = useStore();

    return (
      <>
        <div className="flex-row">
          <select
            value={+store.isActive}
            onChange={(e) => {
              useStore.setState({
                isActive: { "0": false, "1": true }[e.currentTarget.value],
              });
            }}
          >
            <option value="0">{"isActive:false"}</option>
            <option value="1">{"isActive:true"}</option>
          </select>
          <input
            value={store.id}
            onChange={(e) => {
              useStore.setState({ id: e.currentTarget.value });
            }}
          />
          <input
            type="number"
            value={`${store.count}`}
            onChange={(e) => {
              useStore.setState({ count: e.currentTarget.valueAsNumber });
            }}
          />
        </div>
        <button
          onClick={() => {
            useStore.setState(useStore.getInitialState());
          }}
        >
          {"↻"}
        </button>
      </>
    );
  },

  // https://github.com/vercel/swr
  Swr() {
    console.log(guide.Swr.name);

    const repo = useSWRImmutable(
      [
        appDefaultApi.reposOwnerRepoGet,
        { owner: "vercel", repo: "swr" },
        // { headers: { Authorization: "Bearer 200" } },
      ],
      async ([, ...params]) => {
        const data = await appDefaultApi.reposOwnerRepoGet(...params);
        return appSchema.reposOwnerRepoGet.parse(data);
      },
    );
    const pet = useSWRMutation(
      [petstorePetApi.getPetById, { petId: 1 }],
      ([, ...params] /* , options */) => {
        return petstorePetApi.getPetById(...params);
      },
    );

    return (
      <div className="flex-row">
        <div className="flex-1">
          <textarea
            rows={10}
            value={JSON.stringify(repo, null, 2)}
            readOnly
          ></textarea>
          <button
            onClick={() => {
              repo.mutate();
            }}
          >
            {"→"}
          </button>
        </div>
        <div className="flex-1">
          <textarea
            rows={10}
            value={JSON.stringify(pet, null, 2)}
            readOnly
          ></textarea>
          <button
            onClick={() => {
              pet.trigger();
            }}
          >
            {"→"}
          </button>
        </div>
      </div>
    );
  },

  // https://github.com/colinhacks/zod
  // https://github.com/react-hook-form/react-hook-form
  Form() {
    console.log(guide.Form.name);

    const form = useForm({
      values: formPersist.getInitialState(),
      // values: formPersist.getState(),
      resolver: zodResolver(formSchema),
    });

    return (
      <>
        {/* <Watch
          control={form.control}
          compute={formPersist.setState}
          render={() => <></>}
        ></Watch> */}
        <form
          onSubmit={form.handleSubmit(console.log)}
          className="flex-row"
          id="form"
        >
          <Controller
            name="title"
            control={form.control}
            render={({ field }) => (
              <textarea
                rows={10}
                {...field}
                placeholder={field.name}
                className="flex-1"
              ></textarea>
            )}
          ></Controller>
          <Controller
            name="description"
            control={form.control}
            render={({ field }) => (
              <textarea
                rows={10}
                {...field}
                placeholder={field.name}
                className="flex-1"
              ></textarea>
            )}
          ></Controller>
          <Watch
            name={["title", "description"]}
            control={form.control}
            render={(field) => (
              <textarea
                rows={10}
                value={JSON.stringify(field, null, 2)}
                readOnly
                className="flex-1"
              ></textarea>
            )}
          ></Watch>
        </form>
        <button type="submit" disabled={!form.formState.isValid} form="form">
          {"→"}
        </button>
        <button
          type="reset"
          onClick={() => {
            form.reset(formPersist.getInitialState());
          }}
          form="form"
        >
          {"↻"}
        </button>
      </>
    );
  },

  // https://formsubmit.co/documentation
  Formsubmit() {
    return (
      <>
        <form
          action="https://formsubmit.co/fokecola@mailgolem.com"
          method="POST"
          id="formsubmit"
        ></form>
        <input
          type="hidden"
          name="_next"
          value={new URL("/", env.BASE_URL).href}
          form="formsubmit"
        />
        <input type="hidden" name="_captcha" value="true" form="formsubmit" />
        <input type="hidden" name="_template" value="table" form="formsubmit" />
        <input
          type="text"
          name="name"
          placeholder="name"
          defaultValue="John Doe"
          form="formsubmit"
        />
        <input
          type="email"
          name="email"
          placeholder="email"
          defaultValue="john.doe@example.com"
          form="formsubmit"
        />
        <button type="submit" form="formsubmit">
          {"→"}
        </button>
      </>
    );
  },

  //
  Print() {
    console.log(guide.Print.name);

    return (
      <>
        <style jsx global>{`
          @media not print {
            [data-print] {
              display: none;
            }
          }
          @media print {
            @page {
              size: 8.5in calc(11in * 1);
              margin: 0;
            }
            [data-print] {
              margin: auto;
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
        <button
          onClick={() => {
            print();
          }}
        >
          {"🖶"}
        </button>
        <div data-isolate data-print className="typography">
          <h1>Styling the Web: A Modern CSS Journey</h1>
          <p>
            CSS has come a long way since its inception. From simple layout
            tweaks to complex responsive designs, it&apos;s become an essential
            tool for crafting delightful web experiences. In this article,
            we&apos;ll explore various HTML elements commonly styled with modern
            CSS utility systems like <code>tailwindcss</code>
            and component libraries.
          </p>
          <h2>Introduction</h2>
          <p>
            Web design today is more accessible than ever. Thanks to
            utility-first frameworks and component-based architectures,
            developers can build beautiful UIs with less effort.
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
            Here&apos;s a sample image to test image styling. Make sure it
            scales well on all screen sizes.
          </p>
          <center>
            <Image
              alt="Cute kitten"
              height={400}
              src="https://images.placeholders.dev/600x400"
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
            &quot;Design is not just what it looks like and feels like. Design
            is how it works.&quot; — Steve Jobs
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
            <abbr title="HyperText Markup Language">HTML</abbr> is the
            foundation of the web.
          </p>
          <h2>Superscript & Subscript</h2>
          <p>
            E = mc<sup>2</sup> is Einstein&apos;s mass-energy equivalence. Water
            is H<sub>2</sub>O.
          </p>
          <h2>Conclusion</h2>
          <p>
            Whether you&apos;re using Tailwind, vanilla CSS, or any other
            system, a solid understanding of how HTML elements behave is key to
            great styling. Test extensively to ensure consistent, accessible
            results across devices.
          </p>
        </div>
      </>
    );
  },

  // https://github.com/paulmillr/qr
  QrCode() {
    console.log(guide.QrCode.name);

    const [inputValue, setInputValue] = useState("qr");
    const qrRef = useRef({
      video: null as null | HTMLVideoElement,
      camera: null as null | Awaited<ReturnType<typeof frontalCamera>>,
      canvas: new QRCanvas({}, { cropToSquare: false }),
      cancel: null as null | (() => void),
    });

    return (
      <>
        <div className="relative aspect-video h-48 border">
          <video
            ref={(instance) => {
              qrRef.current.video = instance;
            }}
            className="absolute inset-0 h-full w-full object-cover"
          ></video>
        </div>
        <div className="flex-row">
          <button
            className="flex-1"
            onClick={async () => {
              if (qrRef.current.video) {
                qrRef.current.camera = await frontalCamera(qrRef.current.video);
                qrRef.current.cancel = frameLoop(() => {
                  if (
                    qrRef.current.video?.videoHeight &&
                    qrRef.current.video?.videoWidth
                  ) {
                    const result = qrRef.current.camera?.readFrame?.(
                      qrRef.current.canvas,
                      true,
                    );
                    console.log(result);
                  }
                });
              }
            }}
          >
            {"▶"}
          </button>
          <button
            className="flex-1"
            onClick={() => {
              if (qrRef.current.video) {
                qrRef.current.video.srcObject = null;
                qrRef.current.camera?.stop();
                qrRef.current.cancel?.();
              }
            }}
          >
            {"⏹"}
          </button>
        </div>
        <div className="relative aspect-video h-32 border">
          <Image
            src={`data:image/svg+xml,${encodeURIComponent(encodeQR(inputValue, "svg"))}`}
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <input
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.currentTarget.value);
          }}
        />
      </>
    );
  },

  // https://webpack.js.org/guides/asset-modules/#url-assets
  // https://nextjs.org/blog/next-16-2-turbopack#web-worker-origin
  // https://github.com/GoogleChromeLabs/comlink
  WebWorkers() {
    console.log(guide.WebWorkers.name);

    const data = useSWRImmutable([guide.WebWorkers], async () => {
      const api = wrap<Api>(
        new Worker(new URL("@/assets/worker.ts", import.meta.url)),
      );
      const sharedApi = wrap<Api>(
        new SharedWorker(new URL("@/assets/worker.ts", import.meta.url)).port,
      );
      await navigator.serviceWorker.register("/service-worker.js", {
        scope: "/",
      });
      return Promise.all([
        api.getDateNow(),
        sharedApi.getDateNow(),
        (async () => {
          const response = await fetch("/get-date-now");
          const text = await response.text();
          return +text;
        })(),
      ]);
    });

    return (
      <>
        <textarea
          rows={10}
          value={JSON.stringify(data, null, 2)}
          readOnly
        ></textarea>
      </>
    );
  },

  // https://github.com/LottieFiles/dotlottie-web/tree/HEAD/packages/react
  Lottie() {
    console.log(guide.Lottie.name);

    return (
      <div data-isolate className="relative m-auto aspect-video h-64 border">
        <DotLottieReact
          src={new URL("@/assets/VrgZppaPQ8.json", import.meta.url).href}
          // src={new URL("@/assets/VrgZppaPQ8.lottie", import.meta.url).href}
          layout={{ fit: "contain" }}
          autoplay
          loop
          renderConfig={{ autoResize: true }}
        ></DotLottieReact>
      </div>
    );
  },

  // https://moz.com/blog/everything-you-never-wanted-to-know-about-google-maps-parameters
  GoogleMapsEmbed() {
    console.log(guide.GoogleMapsEmbed.name);

    return (
      <div data-isolate className="relative m-auto aspect-video h-64 border">
        <iframe
          src="https://maps.google.com/maps?output=embed&q=australia"
          className="absolute inset-0 h-full w-full"
        ></iframe>
      </div>
    );
  },

  // https://github.com/visgl/react-map-gl
  MapLibre() {
    console.log(guide.MapLibre.name);

    const [popup, setPopup] = useState(
      null as null | {
        longitude: number;
        latitude: number;
        description: string;
      },
    );

    return (
      <div data-isolate className="relative m-auto aspect-video h-64 border">
        <link
          rel="stylesheet"
          href={`${new URL("maplibre-gl/dist/maplibre-gl.css", import.meta.url)}`}
        />
        <Map
          mapStyle={colorful({ baseUrl: "https://tiles.versatiles.org" })}
          // mapStyle="https://tiles.openfreemap.org/styles/liberty"
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
  },

  // https://developers.google.com/youtube/player_parameters#Parameters
  YoutubeEmbed() {
    console.log(guide.YoutubeEmbed.name);

    const videoId = "xdKay6bhIMg";

    return (
      <div
        data-isolate
        className="relative m-auto aspect-video h-64 overflow-hidden border"
      >
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?controls=0&autoplay=1&mute=1&loop=1&playlist=${videoId}&rel=0`}
          loading="lazy"
          className="pointer-events-none absolute -top-[calc(var(--h)/2-50%)] h-(--h) w-full touch-none select-none [--h:300%]"
          tabIndex={-1}
        ></iframe>
      </div>
    );
  },

  // https://www.mux.com/docs/guides/modify-playback-behavior#availiable-playback-modifiers
  MuxEmbed() {
    console.log(guide.MuxEmbed.name);

    const videoId = "Hi6we01h00uVvZc00GzvVXZW8C02Y8QC8OX7";

    return (
      <div data-isolate className="relative m-auto aspect-video h-64 border">
        <video
          src={`https://stream.mux.com/${videoId}.m3u8`}
          autoPlay
          muted
          loop
          className="absolute inset-0 h-full w-full object-cover"
        ></video>
      </div>
    );
  },

  // https://github.com/motiondivision/motion
  Motion() {
    console.log(guide.Motion.name);

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
        className="relative m-auto aspect-square h-64 rotate-(--rotate) animate-[grayscale_7s_infinite] rounded-(--rounded) border"
      >
        <style jsx>{`
          @keyframes grayscale {
            0%,
            100% {
              filter: grayscale(0%);
            }
            50% {
              filter: grayscale(100%);
            }
          }
        `}</style>
        <Image
          src="https://github.com/motiondivision.png"
          alt=""
          unoptimized
          fill
          className="rounded-(--rounded) object-contain"
        ></Image>
      </m.div>
    );
  },

  // https://developers.google.com/chart/interactive/docs
  GoogleCharts() {
    console.log(guide.GoogleCharts.name);

    return (
      <>
        <div data-isolate className="relative aspect-video h-48">
          <GoogleChart
            type="PieChart"
            data={[
              ["Task", "Hours per Day"],
              ["Work", 11],
              ["Eat", 2],
              ["Commute", 2],
              ["Watch TV", 2],
              ["Sleep", 7],
            ]}
          ></GoogleChart>
        </div>
        <div data-isolate className="relative aspect-video h-48">
          <GoogleChart
            type="BarChart"
            data={[
              [
                "Genre",
                "Fantasy & Sci Fi",
                "Romance",
                "Mystery/Crime",
                "General",
                "Western",
                "Literature",
              ],
              ["2010", 10, 24, 20, 32, 18, 5],
              ["2020", 16, 22, 23, 30, 16, 9],
              ["2030", 28, 19, 29, 30, 12, 13],
            ]}
            options={{ isStacked: true }}
          ></GoogleChart>
        </div>
      </>
    );
  },

  // https://nextjs.org/docs/app/getting-started/caching
  // https://nextjs.org/docs/app/guides/caching-without-cache-components
  Cache() {
    console.log(guide.Cache.name);

    return (
      <div data-isolate className="relative m-auto aspect-video h-64 border">
        <iframe
          src="/cache"
          className="absolute inset-0 h-full w-full"
        ></iframe>
      </div>
    );
  },

  // https://mantine.dev/hooks/use-pagination/
  Pagination() {
    console.log(guide.Pagination.name);

    const pagination = usePagination({ total: 10 });

    return (
      <div className="flex-row">
        <button
          onClick={() => {
            pagination.previous();
          }}
        >
          {"<"}
        </button>
        {pagination.range.map((item, index) => {
          return pagination.active === item ? (
            <u key={index}>{item}</u>
          ) : (
            <a
              key={index}
              href="#"
              onClick={() => {
                if (item !== "dots") {
                  pagination.setPage(item);
                }
              }}
            >
              {item === "dots" ? "…" : item}
            </a>
          );
        })}
        <button
          onClick={() => {
            pagination.next();
          }}
        >
          {">"}
        </button>
      </div>
    );
  },
};
const guideKeys = Object.keys(guide);
const guideQuery = {
  guide: parseAsStringLiteral(guideKeys).withDefault("Env"),
};
const serializeGuide = createSerializer(guideQuery);
function useGuide() {
  return useQueryStates(guideQuery);
}

const formSchema = z.object({
  title: z.string().nonempty().default(""),
  description: z.string().nonempty().default(""),
});
const formPersist = create(
  persist(() => formSchema.parse({}), { name: "form-persist" }),
);
