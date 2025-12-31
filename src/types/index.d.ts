
import type {
  AppointmentStatus,
  AppointmentType,
} from "@/types/enums";

/* eslint-disable no-unused-vars */
declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

declare type Gender = "male" | "female" | "other";
declare type Status = AppointmentStatus;

declare interface CreateUserParams {
  name: string;
  email: string;
  phone: string;
}
declare interface User extends CreateUserParams {
  $id: string;
}

declare interface RegisterUserParams extends CreateUserParams {
  userID: string;
  birthDate: Date;
  gender: Gender;
  address: string;
  occupation: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  primaryPhysician: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  allergies?: string | undefined;
  currentMedication?: string | undefined;
  familyMedicalHistory?: string | undefined;
  pastMedicalHistory?: string | undefined;
  identificationType?: string | undefined;
  identificationNumber?: string | undefined;
  identificationDocument?: FormData | undefined;
  privacyConsent: boolean;
}

declare type CreateAppointmentParams = {
  userID: string;
  patientID: string;            
  doctor: string;                 
  appointmentDate: Date;        
  appointmentTime?: string;
  reason?: string;
  notes?: string;
  status?: AppointmentStatus;
  type?: AppointmentType;
};

declare type UpdateAppointmentParams = {
  appointmentId: string;
  userID: string;
  appointment: Appointment;
  type: string;
};
