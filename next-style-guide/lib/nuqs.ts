import { formatISO, parseISO } from "date-fns";
import { createParser } from "nuqs";

export const parseAsIsoDate2 = createParser({
  parse(value) {
    return parseISO(value);
  },
  serialize(value) {
    return formatISO(value, { representation: "date" });
  },
});
