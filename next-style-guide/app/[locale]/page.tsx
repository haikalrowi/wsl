"use client";

import { PageClient } from "./page-client";

export default function Page() {
  return (
    <main className="mx-auto max-w-xs **:flex **:flex-col **:gap-1 [&_button]:[all:revert] [&_input,select,textarea]:border">
      {/*  */}
      <PageClient />
      {/*  */}
      <section>
        <p></p>
        <ul>
          <li></li>
        </ul>
      </section>
    </main>
  );
}
