import { parseAsIsoDate2 } from "@/lib/nuqs";
import {
  createSerializer,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from "nuqs";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const query = {
  name: parseAsString.withDefault("John"),
  age: parseAsInteger.withDefault(20),
  isAdult: parseAsBoolean.withDefault(true),
  date: parseAsIsoDate2.withDefault(new Date()),
};
const store = {
  id: "",
  count: 0,
  isActive: false,
};

export const [
  //
  serializeAppQuery,
  useAppQuery,
  useAppStore,
] = [
  //
  createSerializer(query),
  function () {
    return useQueryStates(query);
  },
  create(persist(() => store, { name: "use-app-store" })),
];
