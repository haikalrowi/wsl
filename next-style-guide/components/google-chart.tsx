import { useEffect, useRef } from "react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any;
  }
}

let googleChartLoadingPromise = null as null | Promise<unknown>;

function loadGoogleChart() {
  if (!googleChartLoadingPromise) {
    googleChartLoadingPromise = new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://www.gstatic.com/charts/loader.js";
      script.onload = () => {
        window.google.charts.load("52", { packages: ["corechart"] });
        // window.google.charts.load("current", { packages: ["corechart"] });
        window.google.charts.setOnLoadCallback(resolve);
      };
      document.body.appendChild(script);
    });
  }

  return googleChartLoadingPromise;
}

export function GoogleChart(props: {
  /** https://developers.google.com/chart/interactive/docs/gallery */
  type: string;
  /** https://developers.google.com/chart/interactive/docs/reference#arraytodatatable */
  data: unknown;
  /** https://developers.google.com/chart/interactive/docs/reference#draw */
  options?: unknown;
}) {
  const chartDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadGoogleChart().then(() => {
      const dataTable = window.google.visualization.arrayToDataTable(
        props.data,
      );
      new window.google.visualization[props.type](chartDivRef.current).draw(
        dataTable,
        props.options,
      );
    });
  }, [props.type, props.data, props.options]);

  return (
    <div
      ref={chartDivRef}
      className="absolute inset-0 h-full w-full [&_.google-visualization-tooltip]:pointer-events-none"
    ></div>
  );
}
