import { Client, Databases, Storage, Users, Messaging } from "node-appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.PROJECT_ID!)
  .setKey(process.env.API_KEY!);

export const databases = new Databases(client);
export const storage = new Storage(client);
export const users = new Users(client);
export const messaging = new Messaging(client);
