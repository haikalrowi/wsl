import {
  createSerializer,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from "nuqs";
import { create } from "zustand";
import { combine, persist } from "zustand/middleware";

const searchParams = {
  name: parseAsString.withDefault("John"),
  age: parseAsInteger.withDefault(20),
  isAdult: parseAsBoolean.withDefault(true),
};

export const serializeApp = createSerializer(searchParams);

export const useStoreAppImpl = create(
  persist(
    combine(
      {
        id: "",
        count: 0,
        isActive: false,
      },
      (set) => ({ set }),
    ),
    { name: "store-app" },
  ),
);

export function useStoreApp() {
  const queryStates = useQueryStates(searchParams);

  return {
    searchParams: {
      ...queryStates[0],
      set: queryStates[1],
    },
    ...useStoreAppImpl(),
  };
}
