import { ImageResponse } from "next/og";

const ICON_SVG = import("@/app/[locale]/icon.svg?bytes" as string);

export async function getIconSvg(style?: React.CSSProperties) {
  const { default: iconSvg } = await ICON_SVG;

  return (
    <img
      src={`data:image/svg+xml,${encodeURIComponent(new TextDecoder().decode(iconSvg))}`}
      alt=""
      style={style}
    />
  );
}

// https://developers.google.com/search/docs/appearance/favicon-in-search#guidelines
const SIZES = [48, 96, 192];

// https://nextjs.org/docs/app/api-reference/functions/generate-image-metadata
export function generateImageMetadata() {
  return SIZES.map((item) => ({
    id: `${item}`,
    alt: "",
    size: { width: item, height: item },
    contentType: "image/png",
  }));
}

export async function getIconOrAppleIcon(props: { id: Promise<string> }) {
  const id = await props.id;

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
      }}
    >
      {await getIconSvg()}
    </div>,
    { width: +id, height: +id },
  );
}
