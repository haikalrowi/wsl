export const env = {
  BASE_URL: "http://localhost:3000",
  LOCALES: ["en", "ja"] as const,
  SERVER: process.env.SERVER,
  NEXT_PUBLIC_CLIENT: process.env.NEXT_PUBLIC_CLIENT,
  NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN:
    process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN,
};
