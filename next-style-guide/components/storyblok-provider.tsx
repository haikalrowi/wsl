import { getStoryblokApi } from "@/lib/storyblok";

export default function StoryblokProvider({
  children,
}: React.PropsWithChildren) {
  getStoryblokApi();

  return children;
}
