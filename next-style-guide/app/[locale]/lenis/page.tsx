import { Lenis } from "@/components/lenis";

export default async function Page() {
  return (
    <>
      <Lenis></Lenis>
      <div className="utils">
        {Array.from({ length: 64 }).map((_, index, items) => (
          <div
            key={index}
            className="mx-(--mx) bg-black"
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
