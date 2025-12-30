"use server";
import { ID, Query } from "node-appwrite";
import { databases, messaging } from "../appwrite.config";
import { formatDateTime, parseStringify } from "../utils";
import { Appointment } from "../../../types/appwrite.types";
import { revalidatePath } from "next/cache";
const { APPOINTMENT_COLLECTION_ID, NEXT_PUBLIC_DATABASE_ID } = process.env;

export const createAppointment = async (
  appointmentData: CreateAppointmentParams
) => {
  try {
    const newAppointment = await databases.createDocument(
      NEXT_PUBLIC_DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      appointmentData
    );
    return parseStringify(newAppointment);
  } catch (error) {
    console.log("Error creating appointment: ", error);
  }
};

export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await databases.getDocument(
      NEXT_PUBLIC_DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId
    );
    return parseStringify(appointment);
  } catch (error) {
    console.log("Error getting appointment: ", error);
  }
};

//  GET RECENT APPOINTMENTS
export const getRecentAppointmentList = async () => {
  try {
    const appointments = await databases.listDocuments(
      NEXT_PUBLIC_DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")]
    );

    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const counts = (appointments.documents as Appointment[]).reduce(
      (acc, appointment) => {
        switch (appointment.status) {
          case "scheduled":
            acc.scheduledCount++;
            break;
          case "pending":
            acc.pendingCount++;
            break;
          case "cancelled":
            acc.cancelledCount++;
            break;
        }
        return acc;
      },
      initialCounts
    );

    const data = {
      totalCount: appointments.total,
      ...counts,
      documents: appointments.documents,
    };

    return parseStringify(data);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the recent appointments:",
      error
    );
  }
};

export const updateAppointment = async ({
  appointment,
  userID,
  appointmentId,
  type,
}: UpdateAppointmentParams) => {
  try {
    const updatedAppointment = await databases.updateDocument(
      NEXT_PUBLIC_DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      appointment
    );

    if (!updateAppointment) throw new Error("Appointment not found");
    const smsMessage = `Greetings from Appointly. ${
      type === "schedule"
        ? `Your appointment is confirmed for ${
            appointment.schedule
              ? formatDateTime(appointment.schedule).dateTime
              : "a scheduled time"
          } with Dr. ${appointment.primaryPhysician}.`
        : `We regret to inform you that your appointment for ${
            appointment.schedule
              ? formatDateTime(appointment.schedule).dateTime
              : "a scheduled time"
          } is cancelled. Reason: ${
            appointment.cancellationReason || "not provided"
          }.`
    }`;
    await sendSMSNotification(userID, smsMessage);
    revalidatePath("/admin");
    return parseStringify(updatedAppointment);
  } catch (error) {
    console.log("Error updating appointment: ", error);
  }
};

export const sendSMSNotification = async (userID: string, content: string) => {
  try {
    const message = await messaging.createSms(
      ID.unique(),
      content,
      [],
      [userID]
    );
    return parseStringify(message);
  } catch (error) {
    console.log("Error updating appointment: ", error);
  }
};
