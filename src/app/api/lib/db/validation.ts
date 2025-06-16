import { ZodError } from 'zod';
import { validateCollectionData, prepareDataForValidation } from './schemas';
import { Db } from 'mongodb';

export async function validateAndInsert(db: any, collectionName: string, data: any) {
  try {
    const preparedData = prepareDataForValidation(data);

    const validatedData = validateCollectionData(collectionName, preparedData);

    return await db.collection(collectionName).insertOne(validatedData);
  } catch (error) {
    const validationError = error as unknown as ZodError;
    if (validationError.name === 'ZodError') {
      throw {
        isError: true,
        code: 'VALIDATION_ERROR',
        details: validationError.errors,
      };
    }
    throw error;
  }
}

export async function validateAndUpdate(db: Db, collectionName: string, query: any, data: any) {
  try {
    const preparedData = prepareDataForValidation(data);

    const validatedData = validateCollectionData(collectionName, preparedData);

    // Update with validated data
    return await db.collection(collectionName).updateOne(query, { $set: validatedData });
  } catch (error) {
    const validationError = error as unknown as ZodError;
    if (validationError.name === 'ZodError') {
      throw {
        isError: true,
        code: 'VALIDATION_ERROR',
        details: validationError.errors,
      };
    }
    throw error;
  }
}
