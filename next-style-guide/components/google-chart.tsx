import { useEffect, useRef } from "react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any;
  }
}

const promise = new Promise((resolve) => {
  const script = document.createElement("script");
  script.src = "https://www.gstatic.com/charts/loader.js";
  script.onload = () => {
    window.google.charts.load("52", { packages: ["corechart"] });
    // window.google.charts.load("current", { packages: ["corechart"] });
    window.google.charts.setOnLoadCallback(resolve);
  };
  document.body.appendChild(script);
});

export function GoogleChart({
  type,
  data,
  options,
}: {
  /** https://developers.google.com/chart/interactive/docs/gallery */
  type: string;
  /** https://developers.google.com/chart/interactive/docs/reference#arraytodatatable */
  data: unknown;
  /** https://developers.google.com/chart/interactive/docs/reference#draw */
  options?: unknown;
}) {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    promise.then(() => {
      const dataTable = window.google.visualization.arrayToDataTable(data);
      new window.google.visualization[type](divRef.current).draw(
        dataTable,
        options,
      );
    });
  }, [type, data, options]);

  return (
    <div
      ref={divRef}
      className="absolute inset-0 h-full w-full [&_.google-visualization-tooltip]:pointer-events-none"
    ></div>
  );
}
