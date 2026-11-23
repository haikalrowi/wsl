import { Lenis } from "@/components/lenis";

export default async function Page() {
  return (
    <>
      <Lenis></Lenis>
      <div className="flex flex-col gap-1 p-3">
        {Array.from({ length: 64 }).map((_, index, items) => (
          <div
            key={index}
            className="mx-(--mx) bg-(--ui-foreground) p-1"
            style={
              {
                "--mx": `${50 * (index / items.length)}%`,
              } as React.CSSProperties
            }
          ></div>
        ))}
      </div>
    </>
  );
}
