import useSWR from "swr";
import useSWRImmutable from "swr/immutable";

export function useData<
  Context,
  Input extends unknown[],
  Output,
  ProcessedOutput = Output,
>(
  context: Context,
  process: (...args: Input) => Promise<Output>,
  input: Input,
  processOutput?: (output: Output) => ProcessedOutput,
) {
  return useSWR(
    {
      process,
      input,
    },
    () =>
      //
      process.call(context, ...input).then(processOutput),
  );
}

export function useDataImmutable<
  Context,
  Input extends unknown[],
  Output,
  ProcessedOutput = Output,
>(
  context: Context,
  process: (...args: Input) => Promise<Output>,
  input: Input,
  processOutput?: (output: Output) => ProcessedOutput,
) {
  return useSWRImmutable(
    {
      process,
      input,
    },
    () =>
      //
      process.call(context, ...input).then(processOutput),
  );
}
