export function handleError(
  error: unknown,
  defaultError = "Unknown error",
  returnMessage = false
) {
  const err = error as {
    response?: { data?: { message?: string } };
    message?: string;
  };
  const message = err?.response?.data?.message || err?.message || defaultError;

  if (returnMessage) return message;
  throw new Error(message);
}
