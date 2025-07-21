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