export function errorMessage(error: unknown): string {
  let err = 'Unknown error';
  if (typeof error === 'object' && error !== null && 'message' in error)
    err = (error as { message: string }).message;

  return err;
}
