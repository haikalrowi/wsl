import {
  createSerializer,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from "nuqs";
import { create } from "zustand";
import { combine } from "zustand/middleware";

const searchParams = {
  name: parseAsString.withDefault("John"),
  age: parseAsInteger.withDefault(20),
  isAdult: parseAsBoolean.withDefault(true),
};

export const serializeApp = createSerializer(searchParams);

export const useStoreAppImpl = create(
  // persist(
  combine(
    {
      id: "",
      count: 0,
      isActive: false,
    },
    (set) => ({ set }),
  ),
  // { name: "store-app" },
  // ),
);

export function useStoreApp() {
  const searchParamsState = useQueryStates(searchParams);

  return {
    searchParams: {
      ...searchParamsState[0],
      set: searchParamsState[1],
    },
    ...useStoreAppImpl(),
  };
}
