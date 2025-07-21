export const UserStatus = {
  active: "active",
  inactive: "inactive",
} as const;

export type EUserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export const Role = {
  admin: "admin",
  customer: "customer",
} as const;

export type ERole = (typeof Role)[keyof typeof Role];

export const BookingStatus = {
  confirmed: "confirmed",
  cancelled: "cancelled",
} as const;

export type EBookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];
