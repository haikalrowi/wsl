import { getIconSvg } from "@/utils/get-icon";
import { ImageResponse } from "next/og";

export const alt = "";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        backgroundColor: "white",
      }}
    >
      {await getIconSvg({ margin: "auto", height: "100%" })}
    </div>,
    { width: size.width, height: size.height },
  );
}
