import * as z from "zod";
import {
  Configuration as AppConfiguration,
  DefaultApi,
  type BaseAPI,
} from "./app/typescript-fetch-client";
import {
  PetApi,
  Configuration as PetstoreConfiguration,
} from "./petstore/typescript-fetch-client";

type DefaultApiKey = Exclude<
  keyof typeof DefaultApi.prototype,
  keyof typeof BaseAPI.prototype | `${string}Raw`
>;

export const openapi = {
  app: {
    defaultApi: new DefaultApi(
      new AppConfiguration({
        basePath: "https://api.github.com",
        middleware: [
          {
            async pre(context) {
              context.init.headers = {
                Authorization: "Bearer",
                ...context.init.headers,
              };
              return context;
            },
          },
        ],
      }),
    ),
    schema: {
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
    } satisfies Partial<Record<DefaultApiKey, z.ZodType>>,
  },
  petstore: {
    petApi: new PetApi(
      new PetstoreConfiguration({
        basePath: "https://petstore.swagger.io/v2",
      }),
    ),
  },
};
