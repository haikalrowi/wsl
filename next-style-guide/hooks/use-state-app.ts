import { parseAsIsoDate2 } from "@/lib/nuqs";
import {
  createSerializer,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from "nuqs";
import { create } from "zustand";
import { combine, persist } from "zustand/middleware";

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

export const [serialize, useQuery, useStore] = [
  //
  createSerializer(query),

  //
  function () {
    return useQueryStates(query);
  },

  //
  create(
    persist(
      combine(store, (set) => ({ set })),
      { name: "use-store-app" },
    ),
  ),
];
