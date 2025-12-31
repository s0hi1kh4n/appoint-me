import { z } from "zod";
import {
  APPOINTMENT_STATUS,
  APPOINTMENT_TYPE,
} from "@/types/enums";


export const UserFormValidation = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"),
});

export const PatientFormValidation = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"),
  birthDate: z.coerce.date(),
  gender: z.enum(["male", "female", "other"]),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address must be at most 500 characters"),
  occupation: z
    .string()
    .min(2, "Occupation must be at least 2 characters")
    .max(500, "Occupation must be at most 500 characters"),
  emergencyContactName: z
    .string()
    .min(2, "Contact name must be at least 2 characters")
    .max(50, "Contact name must be at most 50 characters"),
  emergencyContactNumber: z
    .string()
    .refine(
      (emergencyContactNumber) => /^\+\d{10,15}$/.test(emergencyContactNumber),
      "Invalid phone number"
    ),
  primaryPhysician: z.string().min(2, "Select at least one doctor"),
  insuranceProvider: z
    .string()
    .min(2, "Insurance name must be at least 2 characters")
    .max(50, "Insurance name must be at most 50 characters"),
  insurancePolicyNumber: z
    .string()
    .min(2, "Policy number must be at least 2 characters")
    .max(50, "Policy number must be at most 50 characters"),
  allergies: z.string().optional(),
  currentMedication: z.string().optional(),
  familyMedicalHistory: z.string().optional(),
  pastMedicalHistory: z.string().optional(),
  identificationType: z.string().optional(),
  identificationNumber: z.string().optional(),
  identificationDocument: z.custom<File[]>().optional(),
  treatmentConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "You must consent to treatment in order to proceed",
    }),
  disclosureConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "You must consent to disclosure in order to proceed",
    }),
  privacyConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "You must consent to privacy in order to proceed",
    }),
});

// export const CreateAppointmentSchema = z.object({
//   primaryPhysician: z.string().min(2, "Select at least one doctor"),
//   schedule: z.coerce.date(),
//   reason: z.string().optional(),
//   note: z.string().optional(),

//   status: z.enum([
//     APPOINTMENT_STATUS.PENDING,
//     APPOINTMENT_STATUS.SCHEDULED,
//     APPOINTMENT_STATUS.CANCELLED,
//   ]),

//   type: z.enum([
//     APPOINTMENT_TYPE.CONSULTATION,
//     APPOINTMENT_TYPE.FOLLOW_UP,
//     APPOINTMENT_TYPE.EMERGENCY,
//   ]),

//   cancellationReason: z.string().optional(),
// });

// base
const BaseAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Select a doctor"),
  schedule: z.coerce.date(),
  reason: z.string().optional(),
  note: z.string().optional(),
});

// create
export const CreateAppointmentSchema = BaseAppointmentSchema.extend({
  status: z.literal(APPOINTMENT_STATUS.PENDING),
  type: z.enum([
    APPOINTMENT_TYPE.CONSULTATION,
    APPOINTMENT_TYPE.FOLLOW_UP,
    APPOINTMENT_TYPE.EMERGENCY,
  ]),
});

// schedule 
export const ScheduleAppointmentSchema = BaseAppointmentSchema.extend({
  status: z.literal(APPOINTMENT_STATUS.SCHEDULED),
});

// cancel
export const CancelAppointmentSchema = z.object({
  cancellationReason: z
    .string()
    .min(5, "Please provide a reason for cancellation"),

  status: z.literal(APPOINTMENT_STATUS.CANCELLED),
});

// switch
export function getAppointmentSchema(
  type: "create" | "schedule" | "cancel"
) {
  switch (type) {
    case "create":
      return CreateAppointmentSchema;
    case "cancel":
      return CancelAppointmentSchema;
    default:
      return ScheduleAppointmentSchema;
  }
}
