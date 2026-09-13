import { getStoryblokApi } from "@/lib/storyblok";

export function StoryblokProvider({ children }: React.PropsWithChildren) {
  getStoryblokApi();

  return children;
}
