export const APPOINTMENT_STATUS = {
  PENDING: "pending",
  SCHEDULED: "scheduled",
  CANCELLED: "cancelled",
} as const;

export type AppointmentStatus =
  (typeof APPOINTMENT_STATUS)[keyof typeof APPOINTMENT_STATUS];

export const APPOINTMENT_TYPE = {
  CONSULTATION: "consultation",
  FOLLOW_UP: "follow-up",
  EMERGENCY: "emergency",
} as const;

export type AppointmentType =
  (typeof APPOINTMENT_TYPE)[keyof typeof APPOINTMENT_TYPE];
