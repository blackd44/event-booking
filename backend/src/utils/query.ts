import { Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

export function getMinMaxFilter<T>(min?: T, max?: T) {
  if (min && max) return Between(min, max);
  if (min) return MoreThanOrEqual(min);
  if (max) return LessThanOrEqual(max);
  return null;
}
