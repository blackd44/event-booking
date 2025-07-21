export const formatDateTimeForInput = (isoString: string): string => {
  const date = new Date(isoString);
  // Format as YYYY-MM-DDTHH:MM for datetime-local input
  return date.toISOString().slice(0, 16);
};