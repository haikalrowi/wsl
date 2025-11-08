import useSWR from "swr";
import useSWRImmutable from "swr/immutable";

export function useData<
  Context,
  Input extends unknown[],
  Output,
  ValidateOutput = Output,
>(
  x: [
    context: Context,
    process: (...args: Input) => Promise<Output>,
    input: Input,
    validateOutput?: (output: Output) => ValidateOutput,
  ],
) {
  return useSWR(
    {
      process: x[1],
      input: x[2],
    },
    () => x[1].call(x[0], ...x[2]).then(x[3]),
  );
}

export function useDataImmutable<
  Context,
  Input extends unknown[],
  Output,
  ValidateOutput = Output,
>(
  x: [
    context: Context,
    process: (...args: Input) => Promise<Output>,
    input: Input,
    validateOutput?: (output: Output) => ValidateOutput,
  ],
) {
  return useSWRImmutable(
    {
      process: x[1],
      input: x[2],
    },
    () => x[1].call(x[0], ...x[2]).then(x[3]),
  );
}
