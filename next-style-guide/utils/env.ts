export const env = {
  BASE_URL: "http://localhost:3000",
  LOCALES: ["en", "ja"] as const,
  NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN:
    process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN,
};
