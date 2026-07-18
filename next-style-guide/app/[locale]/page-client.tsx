"use client";

import { Api } from "@/assets/worker";
import { GoogleChart } from "@/components/google-chart";
import { Link } from "@/components/link";
import { useQuery, useStore } from "@/hooks/use-state-app";
import { useChangeLocale, useCurrentLocale, useI18n } from "@/locales/client";
import { appDefaultApi, appSchema, petstorePetApi } from "@/openapi";
import { env } from "@/utils/env";
import FullCalendar from "@fullcalendar/react";
import daygrid from "@fullcalendar/react/daygrid";
import multimonth from "@fullcalendar/react/multimonth";
import "@fullcalendar/react/skeleton.css";
import timegrid from "@fullcalendar/react/timegrid";
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
        <input
          type="number"
          value={query.age}
          onChange={(e) => {
            setQuery(() => ({ age: e.currentTarget.valueAsNumber }));
          }}
        />
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
          hidden
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
              size: 210mm calc(4.7 * 297mm);
              margin: 16px;
            }
            * {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            html,
            body {
              margin: 0;
            }
            :not(:has([data-print]), [data-print], [data-print] *) {
              display: none;
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
        <div
          data-isolate
          data-print
          className="typeset"
          dangerouslySetInnerHTML={{
            __html: `<h1>Building a Streaming Chatbot</h1>
<p>
  The <code>useChat</code> hook makes it effortless to create a conversational
  user interface for your chatbot application. It enables the streaming of chat
  messages from your AI provider, manages the chat state, and updates the UI
  automatically as new messages arrive.
</p>
<p>
  To summarize, the <code>useChat</code> hook provides the following features:
</p>
<ul>
  <li>
    <strong>Message Streaming</strong>: All the messages from the AI provider
    are streamed to the chat UI in real-time.
  </li>
  <li>
    <strong>Managed States</strong>: The hook manages the states for input,
    messages, status, error and more for you.
  </li>
  <li>
    <strong>Seamless Integration</strong>: Easily integrate your chat AI into
    any design or layout with minimal effort.
  </li>
</ul>
<p>
  In this guide, you will learn how to use the <code>useChat</code> hook to
  create a chatbot application with real-time message streaming. Check out our
  <a href="/docs/ai-sdk-ui/chatbot-tool-usage">chatbot with tools guide</a> to
  learn how to use tools in your chatbot.
</p>
<h2>Example</h2>
<p>The request flow works like this:</p>
<ol>
  <li>
    The user submits a message and <code>sendMessage</code> posts it to your API
    route.
  </li>
  <li>Your route calls the provider and returns a UI message stream.</li>
  <li>
    The hook appends chunks to the last message as they arrive, re-rendering as
    it goes.
  </li>
</ol>
<pre><code>'use client';

import { useChat } from '@ai-sdk/react';

export default function Chat() {
  const { messages, sendMessage, status } = useChat();

  return (
    &lt;&gt;
      {messages.map(message =&gt; (
        &lt;Message key={message.id} message={message} /&gt;
      ))}
      &lt;ChatInput
        onSubmit={text =&gt; sendMessage({ text })}
        disabled={status !== 'ready'}
      /&gt;
    &lt;/&gt;
  );
}</code>
</pre>
<pre><code>import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}</code>
</pre>
<blockquote>
  <p>
    The UI messages have a new <code>parts</code> property that contains the
    message parts. We recommend rendering the messages using the
    <code>parts</code> property instead of the <code>content</code> property.
    The parts property supports different message types, including text, tool
    invocation, and tool result, and allows for more flexible and complex chat
    UIs.
  </p>
</blockquote>
<p>
  In the <code>Page</code> component, the <code>useChat</code> hook will request
  to your AI provider endpoint whenever the user sends a message using
  <code>sendMessage</code>. The messages are then streamed back in real-time and
  displayed in the chat UI.
</p>
<h2>Customized UI</h2>
<p>
  <code>useChat</code> also provides ways to manage the chat message states via
  code, show status, and update messages without being triggered by user
  interactions.
</p>
<h3>Status</h3>
<p>
  The <code>useChat</code> hook returns a <code>status</code>. It has the
  following possible values:
</p>
<ul>
  <li>
    <code>submitted</code>: The message has been sent to the API and we're
    awaiting the start of the response stream.
  </li>
  <li>
    <code>streaming</code>: The response is actively streaming in from the API,
    receiving chunks of data.
  </li>
  <li>
    <code>ready</code>: The full response has been received and processed; a new
    user message can be submitted.
  </li>
  <li>
    <code>error</code>: An error occurred during the API request, preventing
    successful completion.
  </li>
</ul>
<pre><code>const { messages, sendMessage, status, stop } = useChat({
  transport: new DefaultChatTransport({ api: '/api/chat' }),
});

// ...

{(status === 'submitted' || status === 'streaming') &amp;&amp; (
  &lt;div&gt;
    {status === 'submitted' &amp;&amp; &lt;Spinner /&gt;}
    &lt;button type="button" onClick={() =&gt; stop()}&gt;
      Stop
    &lt;/button&gt;
  &lt;/div&gt;
)}</code>
</pre>
<h3>Error State</h3>
<p>
  Similarly, the <code>error</code> state reflects the error object thrown
  during the fetch request. It can be used to display an error message, disable
  the submit button, or show a retry button:
</p>
<blockquote>
  <p>
    We recommend showing a generic error message to the user, such as "Something
    went wrong." This is a good practice to avoid leaking information from the
    server.
  </p>
</blockquote>
<pre><code>const { messages, sendMessage, error, regenerate } = useChat({
  transport: new DefaultChatTransport({ api: '/api/chat' }),
});

// ...

{error &amp;&amp; (
  &lt;&gt;
    &lt;div&gt;An error occurred.&lt;/div&gt;
    &lt;button type="button" onClick={() =&gt; regenerate()}&gt;
      Retry
    &lt;/button&gt;
  &lt;/&gt;
)}</code>
</pre>
<h3>Cancellation and regeneration</h3>
<p>
  It's also a common use case to abort the response message while it's still
  streaming back from the AI provider. You can do this by calling the
  <code>stop</code> function returned by the <code>useChat</code> hook.
</p>
<pre><code>const { stop, status } = useChat();

&lt;button
  onClick={stop}
  disabled={!(status === 'streaming' || status === 'submitted')}
&gt;
  Stop
&lt;/button&gt;</code>
</pre>
<hr />
<h2>API reference</h2>
<h3>useChat(options)</h3>
<p>
  Creates a chat helper. All options are optional; the defaults talk to
  <code>/api/chat</code> and render at native stream speed.
</p>
<table>
  <thead>
    <tr>
      <th>Prop</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>transport</code>
      </td>
      <td>
        <code>ChatTransport&lt;UIMessage&gt;</code>
      </td>
      <td>How messages reach your API route</td>
    </tr>
    <tr>
      <td>
        <code>messages</code>
      </td>
      <td>
        <code>UIMessage[]</code>
      </td>
      <td>Initial messages to seed the conversation</td>
    </tr>
    <tr>
      <td>
        <code>onFinish</code>
      </td>
      <td>
        <code>(event: FinishEvent) =&gt; void</code>
      </td>
      <td>Runs when the assistant response completes</td>
    </tr>
    <tr>
      <td>
        <code>onError</code>
      </td>
      <td>
        <code>(error: Error) =&gt; void</code>
      </td>
      <td>Runs when the fetch request fails</td>
    </tr>
    <tr>
      <td>
        <code>throttle</code>
      </td>
      <td>
        <code>number</code>
      </td>
      <td>Milliseconds between UI updates while streaming</td>
    </tr>
  </tbody>
</table>
<h2>Event Callbacks</h2>
<p>
  <code>useChat</code> provides optional event callbacks that you can use to
  handle different stages of the chatbot lifecycle:
</p>
<ul>
  <li>
    <code>onFinish</code>: Called when the assistant response is completed. The
    event includes the response message, all messages, and flags for abort,
    disconnect, and errors.
  </li>
  <li>
    <code>onError</code>: Called when an error occurs during the fetch request.
  </li>
  <li><code>onData</code>: Called whenever a data part is received.</li>
</ul>
<p>
  These callbacks can be used to trigger additional actions, such as logging,
  analytics, or custom UI updates.
</p>
<pre><code>const { messages } = useChat({
  onFinish: ({ message }) =&gt; saveToHistory(message),
  onError: error =&gt; console.error(error),
});</code>
</pre>
<hr />
<h2>Math</h2>
<p>
  Display math sits in the flow rhythm and scrolls when it runs long. Inline
  math like
  <math>
    <msup>
      <mi>e</mi>
      <mrow>
        <mi>i</mi>
        <mi>π</mi>
      </mrow>
    </msup>
    <mo>+</mo>
    <mn>1</mn>
    <mo>=</mo>
    <mn>0</mn>
  </math>
  rides the line without stretching it.
</p>
<h3>Display</h3>
<p>The quadratic formula, as a block:</p>
<math display="block">
  <mi>x</mi>
  <mo>=</mo>
  <mfrac>
    <mrow>
      <mo>−</mo>
      <mi>b</mi>
      <mo>±</mo>
      <msqrt>
        <mrow>
          <msup>
            <mi>b</mi>
            <mn>2</mn>
          </msup>
          <mo>−</mo>
          <mn>4</mn>
          <mi>a</mi>
          <mi>c</mi>
        </mrow>
      </msqrt>
    </mrow>
    <mrow>
      <mn>2</mn>
      <mi>a</mi>
    </mrow>
  </mfrac>
</math>
<p>
  Prose continues after the block at the normal distance, so equations read as
  part of the argument, not decoration.
</p>
<h3>Overflow</h3>
<p>
  A long expansion scrolls inside its own box instead of breaking the column:
</p>
<math display="block">
  <msup>
    <mrow>
      <mo>(</mo>
      <mi>a</mi>
      <mo>+</mo>
      <mi>b</mi>
      <mo>)</mo>
    </mrow>
    <mn>4</mn>
  </msup>
  <mo>=</mo>
  <msup>
    <mi>a</mi>
    <mn>4</mn>
  </msup>
  <mo>+</mo>
  <mn>4</mn>
  <msup>
    <mi>a</mi>
    <mn>3</mn>
  </msup>
  <mi>b</mi>
  <mo>+</mo>
  <mn>6</mn>
  <msup>
    <mi>a</mi>
    <mn>2</mn>
  </msup>
  <msup>
    <mi>b</mi>
    <mn>2</mn>
  </msup>
  <mo>+</mo>
  <mn>4</mn>
  <mi>a</mi>
  <msup>
    <mi>b</mi>
    <mn>3</mn>
  </msup>
  <mo>+</mo>
  <msup>
    <mi>b</mi>
    <mn>4</mn>
  </msup>
</math>
`,
          }}
        ></div>
      </>
    );
  },

  // https://v7.fullcalendar.io/react
  // https://v7.fullcalendar.io/render-hook-index
  Fullcalendar() {
    return (
      <>
        <div data-isolate className="relative m-auto aspect-video h-80">
          <FullCalendar
            plugins={[daygrid, timegrid, multimonth]}
            initialView="dayGridMonth"
            headerToolbar={{
              start: "prev,next",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,multiMonthYear",
            }}
            buttonClass="bg-black p-1 text-white"
            buttonGroupClass="flex gap-2"
            toolbarClass="flex pb-2"
            toolbarSectionClass="not-first:not-last:mx-auto first:mr-auto last:ml-auto"
            dayHeaderClass="border **:w-full **:text-center"
            dayHeaderDividerClass="border"
            dayRowClass="border"
            dayCellClass="border text-center"
            dayLaneClass="border"
            allDayDividerClass="border"
            slotHeaderDividerClass="border"
            slotHeaderClass="border"
            slotLaneClass="border"
            className="absolute inset-0"
          ></FullCalendar>
        </div>
      </>
    );
  },

  // https://github.com/paulmillr/qr
  Qr() {
    console.log(guide.Qr.name);

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
  Webworker() {
    console.log(guide.Webworker.name);

    const data = useSWRImmutable([guide.Webworker], async () => {
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
          className="absolute inset-0 h-full w-full"
        ></DotLottieReact>
      </div>
    );
  },

  // https://moz.com/blog/everything-you-never-wanted-to-know-about-google-maps-parameters
  GoogleMaps() {
    console.log(guide.GoogleMaps.name);

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
  Maplibre() {
    console.log(guide.Maplibre.name);

    const pois: [number, number][] = [
      [10, 20],
      [30, 40],
      [50, 60],
    ];
    const [poi, setPoi] = useState<(typeof pois)[number] | null>();

    return (
      <div data-isolate className="relative m-auto aspect-video h-64 border">
        <style jsx>{`
          @import "${new URL("maplibre-gl/dist/maplibre-gl.css", import.meta.url)}";
        `}</style>
        <Map
          mapStyle={colorful({ baseUrl: "https://tiles.versatiles.org" })}
          // mapStyle="https://tiles.openfreemap.org/styles/liberty"
          cooperativeGestures
        >
          {pois.map((item, index) => (
            <Marker
              key={`${item}-${index}`}
              longitude={item[0]}
              latitude={item[1]}
              onClick={(e) => {
                if (poi) {
                  setPoi(null);
                } else {
                  e.originalEvent.stopPropagation();
                  setPoi(item);
                }
              }}
            >
              <div
                className="size-4 rounded-full bg-red-500"
                onMouseEnter={() => {
                  setPoi(item);
                }}
              ></div>
            </Marker>
          ))}
          {poi && (
            <Popup
              longitude={poi[0]}
              latitude={poi[1]}
              onClose={() => {
                setPoi(null);
              }}
            >
              <p>{`${poi}`}</p>
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
  Youtube() {
    console.log(guide.Youtube.name);

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
  Mux() {
    console.log(guide.Mux.name);

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
