// "use client";

// import { GetStory } from "@/utils/storyblok";
// import { createContext, useContext } from "react";

// export const ConfigContext = createContext<null | GetStory<"page_config">>(
//   null,
// );
// export const PageContext = createContext<null | GetStory>(null);

// export function useConfigContext() {
//   const config = useContext(ConfigContext);

//   if (!config) {
//     throw new Error(ConfigContext.name);
//   }

//   return config;
// }

// export function usePageContext() {
//   const page = useContext(PageContext);

//   if (!page) {
//     throw new Error(PageContext.name);
//   }

//   return page;
// }
