import appJson from "@/openapi/app.openapi.json";
import * as z from "zod";
import { Configuration, DefaultApi, ResponseError } from "./app";

type AppPaths = (typeof appJson)["paths"];

export const openapi = {
  app: {
    api: new DefaultApi(
      new Configuration({
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
    getSWRKey<
      Key extends `${keyof AppPaths[keyof AppPaths]}:${keyof AppPaths}`,
      Argument,
    >(key: Key, arg: Argument) {
      return { key, arg };
    },
    getResponseData<T>(data: T) {
      return { data, error: null };
    },
    getResponseError(error: unknown) {
      if (error instanceof ResponseError) {
        const schema = z.object({
          message: z.string(),
          documentation_url: z.string(),
        });
        return error.response
          .json()
          .then(schema.parse)
          .then((error) => ({ data: null, error }));
      } else {
        throw error;
      }
    },
  },
};
