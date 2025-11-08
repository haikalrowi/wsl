import useSWRMutation from "swr/mutation";

export function useMutation<
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
  return useSWRMutation(
    {
      process: x[1],
      input: x[2],
    },
    (_, { arg }: { arg?: Input }) =>
      x[1].call(x[0], ...(arg ? arg : x[2])).then(x[3]),
  );
}
