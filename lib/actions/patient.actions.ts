/* eslint-disable import/no-anonymous-default-export */
'use server';

import { ID, Query } from 'node-appwrite';
import {
  APPWRITE_DATABASE_ID,
  NEXT_PUBLIC_APPWRITE_BUCKET_ID,
  NEXT_PUBLIC_APPWRITE_ENDPOINT,
  APPWRITE_PATIENT_COLLECTION_ID,
  APPWRITE_PROJECT_ID,
  databases,
  storage,
  users,
} from '../appwrite.config';
import { parseStringify } from '../utils';
import { InputFile } from 'node-appwrite/file';

// https://appwrite.io/docs/references/1.5.x/server-nodejs/users#create
export const createUser = async (user: CreateUserParams) => {
  try {
    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    );

    console.log({ newUser });
    return parseStringify(newUser);
  } catch (error: any) {
    if (error && error?.code === 409) {
      const existingUser = await users.list([
        Query.equal('email', [user.email]),
      ]);

      return existingUser?.users[0];
    }
  }
};

export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);
    return parseStringify(user);
  } catch (error) {
    console.log(error);
  }
};

export const getPatient = async (userId: string) => {
  try {
    const patient = await databases.listDocuments(
      APPWRITE_DATABASE_ID!,
      APPWRITE_PATIENT_COLLECTION_ID!,
      [Query.equal('userId', userId)]
    );

    return parseStringify(patient.documents[0]);
  } catch (error) {
    console.log(error);
  }
};

export const registerPatient = async ({
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
    //To upload images to appWrite, you need to save it in storage instead of in database
    let file;

    if (identificationDocument) {
      const inputFile = InputFile.fromBuffer(
        identificationDocument?.get('blobFile') as Blob,
        identificationDocument?.get('fileName') as string
      );

      //Adding file to storage
      file = await storage.createFile(
        NEXT_PUBLIC_APPWRITE_BUCKET_ID!,
        ID.unique(),
        inputFile
      );
    }

    const newPatient = await databases.createDocument(
      APPWRITE_DATABASE_ID!,
      APPWRITE_PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        identificationDocumentId: file?.$id || null,
        identificationDocumentUrl: `${NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${NEXT_PUBLIC_APPWRITE_BUCKET_ID}/files/${file?.$id}/view?project=${APPWRITE_PROJECT_ID}`,
        ...patient,
      }
    );

    return parseStringify(newPatient);
  } catch (error) {
    console.log(error);
  }
};
