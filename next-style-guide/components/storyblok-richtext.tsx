// import { cn } from "@/lib/utils";
// import { StoryblokRichtext } from "@/utils/storyblok";
// import { StoryblokRichText as StoryblokRichText_ } from "@storyblok/react";

// type StoryblokRichTextProps = React.ComponentProps<typeof StoryblokRichText_>;

// export function StoryblokRichText({
//   StoryblokRichTextProps: { doc, ...StoryblokRichTextProps },
//   typographyClassName = true,
//   className,
//   ...props
// }: {
//   StoryblokRichTextProps: {
//     doc?: StoryblokRichtext;
//   } & Omit<StoryblokRichTextProps, "doc">;
//   typographyClassName?: boolean;
// } & React.ComponentProps<"div">) {
//   return (
//     <div
//       className={cn(typographyClassName && "typography", className)}
//       {...props}
//     >
//       {doc && (
//         <StoryblokRichText_
//           doc={doc as StoryblokRichTextProps["doc"]}
//           {...StoryblokRichTextProps}
//         ></StoryblokRichText_>
//       )}
//     </div>
//   );
// }
