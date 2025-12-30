"use server";
import {
  // BUCKET_ID,
  // DATABASE_ID,
  // ENDPOINT,
  // PATIENT_COLLECTION_ID,
  // PROJECT_ID,
  databases,
  storage,
  users,
} from "../appwrite.config";
const {
  PROJECT_ID,
  API_KEY,
  DATABASE_ID,
  PATIENT_COLLECTION_ID,
  DOCTOR_COLLECTION_ID,
  APPOINTMENT_COLLECTION_ID,
  NEXT_PUBLIC_BUCKET_ID,
  NEXT_PUBLIC_DATABASE_ID,
  NEXT_PUBLIC_ENDPOINT,
} = process.env;
import { ID, Query } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import { parseStringify } from "../utils";

// CREATE APPWRITE USER
export const createUser = async (user: CreateUserParams) => {
  try {
    console.log("heyyyyy");
    // Create new user -> https://appwrite.io/docs/references/1.5.x/server-nodejs/users#create
    const newuser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    );
    console.log("new user created: ", newuser);
    return parseStringify(newuser);
  } catch (error: any) {
    console.log("Error from server actions: ", error);
    if (error && error?.code === 409) {
      const existingUserEmail = await users.list([
        Query.equal("email", [user.email]),
      ]);
      const existingUserPhone = await users.list([
        Query.equal("phone", [user.phone]),
      ]);
      const existingUser = [
        ...existingUserEmail.users,
        ...existingUserPhone.users,
      ];
      console.log(existingUser);
      return existingUser[0];
    }
    console.error("An error occurred while creating a new user:", error);
  }
};

// GET USER
export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);

    return parseStringify(user);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the user details:",
      error
    );
  }
};

// REGISTER PATIENT
// export const registerPatient = async ({
//   identificationDocument,
//   ...patient
// }: RegisterUserParams) => {
//   try {
//     let file;
//     if (identificationDocument) {
//       const inputFile = InputFile.fromBuffer(
//         identificationDocument?.get("blobFile") as Blob,
//         identificationDocument?.get("fileName") as string
//       );
//       file = await storage.createFile(
//         NEXT_PUBLIC_BUCKET_ID!,
//         ID.unique(),
//         inputFile
//       );
//     }
//     // Create new patient document -> https://appwrite.io/docs/references/cloud/server-nodejs/databases#createDocument
//     const newPatient = await databases.createDocument(
//       NEXT_PUBLIC_DATABASE_ID!,
//       PATIENT_COLLECTION_ID!,
//       ID.unique(),
//       {
//         identificationDocumentId: file?.$id ? file.$id : null,
//         identificationDocumentUrl: file?.$id
//           ? `${NEXT_PUBLIC_ENDPOINT}/storage/buckets/${NEXT_PUBLIC_BUCKET_ID}/files/${file.$id}/view??project=${PROJECT_ID}`
//           : null,
//         ...patient,
//       }
//     );
//     return parseStringify(newPatient);
//   } catch (error: any) {
//     console.log("error fetching user for patient register: ", error);
//   }
// };

// REGISTER PATIENT (OPTION A – BASIC DATA ONLY)
export const registerPatient = async (patient: RegisterUserParams) => {
  try {
    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        userID: patient.userID,
        name: patient.name,
        email: patient.email,
        phone: patient.phone, 
      }
    );

    return parseStringify(newPatient);
  } catch (error: any) {
    console.error("❌ Error registering patient:", error);
    throw error;
  }
};







export const getPatient = async (userID: string) => {
  try {
    // Create new user -> https://appwrite.io/docs/references/1.5.x/server-nodejs/users#create
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [Query.equal("userID", userID)]
    );
    return parseStringify(patients.documents[0]);
  } catch (error: any) {
    console.error("An error occurred while fetching a user:", error);
  }
};
