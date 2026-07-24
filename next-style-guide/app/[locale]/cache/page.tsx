import { revalidatePath } from "next/cache";
import { connection } from "next/server";

export default async function Page() {
  await connection();

  const times = await Promise.all([
    cachedGetTime("time"),
    cachedGetTime("time"),
    cachedGetTime(+new Date()),
  ]);

  return (
    <>
      <div className="utils">
        {times.map((item, index) => (
          <p key={index}>{item}</p>
        ))}
        <button
          onClick={async () => {
            "use server";
            revalidatePath("/", "layout");
          }}
        >
          {"revalidatePath(...)"}
        </button>
      </div>
    </>
  );
}

async function cachedGetTime(key?: unknown) {
  "use cache";
  console.log(key);

  return [+new Date(), JSON.stringify({ key })].join();
}
