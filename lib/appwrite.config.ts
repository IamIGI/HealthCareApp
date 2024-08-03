import * as sdk from 'node-appwrite';

//Project backend dashboard:
//https://cloud.appwrite.io/console/project-66ae7b7b002367eeefe2/overview/platforms

export const {
  APPWRITE_PROJECT_ID,
  APPWRITE_API_KEY,
  APPWRITE_DATABASE_ID,
  APPWRITE_PATIENT_COLLECTION_ID,
  APPWRITE_DOCTOR_COLLECTION_ID,
  APPWRITE_APPOINTMENT_COLLECTION_ID,
  APPWRITE_NEXT_PUBLIC_BUCKET_ID,
  APPWRITE_NEXT_PUBLIC_ENDPOINT,
} = process.env;

const client = new sdk.Client();

client
  .setEndpoint(APPWRITE_NEXT_PUBLIC_ENDPOINT!)
  .setProject(APPWRITE_PROJECT_ID!)
  .setKey(APPWRITE_API_KEY!);

export const databases = new sdk.Databases(client);
export const storage = new sdk.Storage(client);
export const functions = new sdk.Functions(client);
export const messaging = new sdk.Messaging(client);
export const users = new sdk.Users(client);
