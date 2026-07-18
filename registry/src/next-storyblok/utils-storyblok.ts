import { PageConfig } from "@/.storyblok/types/000000000000000/storyblok-components";
import { ISbStories, ISbStory } from "@storyblok/react";

type InternalBlocks = NonNullable<PageConfig["INTERNAL_BLOCKS"]>[number];

export type * from "@/.storyblok/types/storyblok";
export type ComponentType = InternalBlocks["component"];
export type BlockType<T extends ComponentType = ComponentType> = Extract<
  InternalBlocks,
  { component: T }
>;
export type GetStory<T extends ComponentType = ComponentType> = ISbStory<
  BlockType<T>
>;
export type GetStories<T extends ComponentType = ComponentType> = ISbStories<
  BlockType<T>
>;
