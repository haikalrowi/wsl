import {
  Configuration as AppConfiguration,
  DefaultApi,
  type BaseAPI,
} from "./app";
import { PetApi, Configuration as PetstoreConfiguration } from "./petstore";

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
  },
  petstore: {
    petApi: new PetApi(
      new PetstoreConfiguration({
        basePath: "https://petstore.swagger.io/v2",
      }),
    ),
  },
};

export { BaseAPI };
