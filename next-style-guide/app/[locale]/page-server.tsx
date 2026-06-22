"use server";

import { env } from "@/utils/env";

export async function getEnv() {
  return env;
}
