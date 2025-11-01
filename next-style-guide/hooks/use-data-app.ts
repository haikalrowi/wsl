import useSWR from "swr";
import * as z from "zod";

const dataSchema = z.object({
  id: z.number(),
  name: z.string(),
  html_url: z.string(),
  owner: z.object({
    id: z.number(),
    login: z.string(),
    html_url: z.string(),
  }),
});

export function useDataApp(
  params: Parameters<typeof fetch>["1"] = {},
  shouldFetch = true,
  // onSuccess,
  // onError,
) {
  return useSWR(
    shouldFetch
      ? {
          key: "key",
          params,
        }
      : null,
    async (arg) => {
      const response = await fetch("https://api.github.com/repos/vercel/swr", {
        ...arg.params,
      });
      return dataSchema.parse(await response.json());
    },
    // { onSuccess, onError },
  );
}
