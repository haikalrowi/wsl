import { Button } from "@ui-sdk/react/button";
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
    <div className="flex flex-col gap-1 p-3">
      {times.map((item, index) => (
        <p key={index}>{item}</p>
      ))}
      <Button
        onClick={async () => {
          "use server";
          revalidatePath("/", "layout");
        }}
      >
        {"revalidatePath(...)"}
      </Button>
    </div>
  );
}

async function cachedGetTime(key?: unknown) {
  "use cache";
  console.log(key);

  return JSON.stringify([+new Date(), { key }]);
}
