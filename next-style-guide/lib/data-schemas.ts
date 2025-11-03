import * as z from "zod";

export const reposOwnerRepoSchema = z.object({
  id: z.number(),
  name: z.string(),
  html_url: z.string(),
  owner: z.object({
    id: z.number(),
    login: z.string(),
    html_url: z.string(),
  }),
});
