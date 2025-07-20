export function handleError(error: unknown, defaultError = "Unknown error") {
  const err = error as {
    response?: { data?: { message?: string } };
    message?: string;
  };
  const message = err?.response?.data?.message || err?.message || defaultError;
  throw new Error(message);
}
