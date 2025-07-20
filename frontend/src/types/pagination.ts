export type TPaginateRes<T> = {
  results: T[];
  total: number;
  start: number;
  end: number;
  size: number;
};
