import { Page } from "@/components/storyblok/page";
import { env } from "@/utils/env";
import {
  BlockType,
  ComponentType,
  GetStories,
  GetStory,
} from "@/utils/storyblok";
import { apiPlugin, storyblokInit } from "@storyblok/react";
import Link from "next/link";
import { cache } from "react";

export const CONFIG_SLUG = "config";
export const HOME_SLUG = "home";

export function getStoryblokApi() {
  const getApi = storyblokInit({
    accessToken: env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN,
    use: [apiPlugin],
    apiOptions: {
      region: "eu",
    },
    components: {
      page: Page,
    } satisfies {
      [P in ComponentType]?: React.ComponentType<{ blok?: BlockType<P> }>;
    },
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return (getApi || useStoryblokApi)();
}

export const cachedGetStory = cache(
  async <T extends ComponentType = ComponentType>(
    slug: string,
    locale: string,
    flushCache?: boolean,
  ) => {
    const storyblokApi = getStoryblokApi();
    if (flushCache) {
      await storyblokApi.flushCache();
    }

    return storyblokApi.getStory(slug, {
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
) {
  const storyblokApi = getStoryblokApi();

  return storyblokApi.getStories({
    content_type: componentType,
    language: locale,
    filter_query: filterQuery,
    page: page,
    per_page: perPage,
  }) as Promise<GetStories<T>>;
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
