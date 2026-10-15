import { getIcon } from "@/utils/get-icon";
import { ImageResponse } from "next/og";

// https://developers.google.com/search/docs/appearance/favicon-in-search#guidelines
const SIZES = [48, 96, 192];

export function generateImageMetadata() {
  return SIZES.map((item) => ({
    id: `${item}`,
    alt: "",
    size: { width: item, height: item },
    contentType: "image/png",
  }));
}

export default async function Icon(props: { id: Promise<string> }) {
  const id = await props.id;

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
      }}
    >
      {await getIcon()}
    </div>,
    { width: +id, height: +id },
  );
}
