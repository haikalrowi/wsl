import useSWRMutation from "swr/mutation";

export function useMutation<
  Context,
  Input extends unknown[],
  Output,
  ProcessedOutput = Output,
>(
  context: Context,
  process: (...args: Input) => Promise<Output>,
  input: Input,
  processOutput?: (output: unknown) => ProcessedOutput,
) {
  return useSWRMutation(
    {
      process,
      input,
    },
    (_, { arg }: { arg?: Input }) =>
      //
      process.call(context, ...(arg ? arg : input)).then(processOutput),
  );
}
