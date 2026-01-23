import { formatISO, parseISO } from "date-fns";
import {
  createParser,
  createSerializer,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from "nuqs";
import { create } from "zustand";
import { combine, persist } from "zustand/middleware";

const parseAsIsoDate2 = createParser({
  parse(value) {
    return parseISO(value);
  },
  serialize(value) {
    return formatISO(value, { representation: "date" });
  },
});

const searchParams = {
  name: parseAsString.withDefault("John"),
  age: parseAsInteger.withDefault(20),
  isAdult: parseAsBoolean.withDefault(true),
  date: parseAsIsoDate2.withDefault(new Date()),
};

export const [serialize, useStoreImpl, useStore] = [
  //
  createSerializer(searchParams),

  //
  create(
    persist(
      combine(
        {
          id: "",
          count: 0,
          isActive: false,
        },
        (set) => ({ set }),
      ),
      { name: "use-store-app" },
    ),
  ),

  //
  function () {
    const searchParamsState = useQueryStates(searchParams);

    return {
      searchParams: {
        ...searchParamsState[0],
        set: searchParamsState[1],
      },
      ...useStoreImpl(),
    };
  },
];
