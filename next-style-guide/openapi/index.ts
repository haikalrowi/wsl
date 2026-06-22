import z from "zod";
import {
  BaseAPI as AppBaseAPI,
  Configuration as AppConfiguration,
  DefaultApi as AppDefaultApi,
} from "./app/typescript-fetch-client";
import {
  Configuration as PetstoreConfiguration,
  PetApi as PetstorePetApi,
} from "./petstore/typescript-fetch-client";

type AppDefaultApiKey = Exclude<
  keyof InstanceType<typeof AppDefaultApi>,
  keyof InstanceType<typeof AppBaseAPI> | `${string}Raw`
>;

export const appDefaultApi = new AppDefaultApi(
  new AppConfiguration({
    basePath: "https://api.github.com",
    middleware: [
      {
        async pre(context) {},
        async post(context) {},
        async onError(context) {},
      },
    ],
    headers: {
      Authorization: "Bearer",
    },
  }),
);
export const appSchema = {
  reposOwnerRepoGet: z.object({
    id: z.number(),
    name: z.string(),
    html_url: z.string(),
    owner: z.object({
      id: z.number(),
      login: z.string(),
      html_url: z.string(),
    }),
  }),
} satisfies Partial<Record<AppDefaultApiKey, z.ZodType>>;
export const petstorePetApi = new PetstorePetApi(
  new PetstoreConfiguration({
    basePath: "https://petstore.swagger.io/v2",
  }),
);
