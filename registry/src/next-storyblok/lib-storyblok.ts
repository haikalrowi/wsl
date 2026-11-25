import { Page } from "@/components/storyblok/page";
import { env } from "@/utils/env";
import {
  BlockType,
  ComponentType,
  GetStories,
  GetStory,
  StoryblokMultilink,
  StoryblokRichtext,
} from "@/utils/storyblok";
import { apiPlugin, StoryblokClient, storyblokInit } from "@storyblok/react";
import Link from "next/link";
import { cache } from "react";

export const CONFIG_SLUG = "config";
export const HOME_SLUG = "home";

const API_OPTIONS = {
  accessToken: env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN,
  region: "eu",
};

export function getStoryblokApi() {
  storyblokInit({
    use: [apiPlugin],
    apiOptions: API_OPTIONS,
    components: {
      page: Page,
    } satisfies {
      [P in ComponentType]?: React.ComponentType<{ blok?: BlockType<P> }>;
    },
  });

  const { storyblokApi } = apiPlugin({
    apiOptions: API_OPTIONS,
  }) as {
    storyblokApi: StoryblokClient;
  };

  return storyblokApi;
}

export const cachedGetStory = cache(
  async <T extends ComponentType = ComponentType>(
    slug: string,
    locale: string,
  ) => {
    const storyblokApi = getStoryblokApi();

    // The client keeps one cache version (`cv`) in memory and sends it with
    // every request, so without a flush it keeps getting old content until the
    // server restarts. Pages re-render only when they are refreshed, so always
    // ask for the latest version.
    await storyblokApi.flushCache();

    return storyblokApi.getStory(slug, {
      version: "published",
      language: locale,
      resolve_relations: ["page.items"],
    }) as Promise<GetStory<T>>;
  },
);

export async function getStories<T extends ComponentType = ComponentType>(
  componentType: T,
  locale: string,
  filterQuery?: unknown,
  page?: number,
  perPage?: number,
  sortBy?: string,
) {
  const storyblokApi = getStoryblokApi();

  // Same reason as in `cachedGetStory`.
  await storyblokApi.flushCache();

  return storyblokApi.getStories({
    version: "published",
    content_type: componentType,
    language: locale,
    filter_query: filterQuery,
    page: page,
    per_page: perPage,
    sort_by: sortBy,
  }) as Promise<GetStories<T>>;
}

// Slugs of all published pages (no folders, no global `config` entry). The
// sitemap and the list of prerendered pages both use it, so they list the same
// pages.
export async function getSlugs() {
  const storyblokApi = getStoryblokApi();

  // Same reason as in `cachedGetStory`.
  await storyblokApi.flushCache();

  const links = await storyblokApi.get("cdn/links", {
    version: "published",
    // Storyblok returns 25 links by default. 1000 is the maximum.
    per_page: 1000,
  });

  return Object.values(links.data.links || {})
    .filter((link) => link.published && !link.is_folder)
    .map((link) => link.slug || "")
    .filter((slug) => !!slug && slug !== CONFIG_SLUG);
}

export function getLinkProps(
  multilink?: StoryblokMultilink,
): React.ComponentProps<typeof Link> {
  const link = multilink?.url || multilink?.cached_url || "#";
  if (link === "#") {
    return { href: link };
  } else if (multilink?.linktype === "story") {
    return { href: link[0] === "/" ? link : `/${link}` };
  } else if (multilink?.linktype === "url") {
    return { href: link, target: "_blank" };
  }

  return { href: link };
}

export function getHeadings(richtext?: StoryblokRichtext) {
  const headings = [];
  if (richtext?.type === "heading") {
    headings.push({
      level: +richtext.attrs?.level,
      text: richtext.content?.map((item) => item.text).join("") || "",
    });
  }
  richtext?.content?.forEach((item) => {
    getHeadings(item).forEach((item) => {
      headings.push(item);
    });
  });

  return headings;
}
