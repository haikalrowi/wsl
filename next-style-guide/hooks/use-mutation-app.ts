import useSWRMutation from "swr/mutation";
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

export function useMutationApp(
  // params,
  shouldFetch = true,
  onSuccess = () => {},
  onError = () => {},
) {
  return useSWRMutation(
    shouldFetch
      ? {
          key: "key",
          // params,
        }
      : null,
    async (_, { arg }: { arg: Parameters<typeof fetch>["1"] }) => {
      const response = await fetch("https://api.github.com/repos/vercel/swr", {
        ...arg,
      });
      return dataSchema.parse(await response.json());
    },
    { onSuccess, onError },
  );
}
