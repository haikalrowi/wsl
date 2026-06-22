import { revalidatePath } from "next/cache";

export default async function Page(props: PageProps<"/[locale]/cache">) {
  const searchParams = await props.searchParams;
  const key = (searchParams.cache || "1") === "1" ? void null : +new Date();
  const times = await Promise.all([
    cachedGetTime(key),
    cachedGetTime(key),
    cachedGetTime(+new Date()),
    cachedGetTime(+new Date()),
  ]);

  return (
    <>
      <div className="utils">
        <div>
          {times.map((item, index) => (
            <p key={index}>{item}</p>
          ))}
        </div>
        <div>
          <button
            onClick={async () => {
              "use server";
              revalidatePath("/", "layout");
            }}
          >
            {"revalidatePath(...)"}
          </button>
        </div>
      </div>
    </>
  );
}

async function cachedGetTime(key?: number) {
  "use cache";
  console.log(key);

  return [+new Date(), key ? "" : "cached"].join(",");
}
