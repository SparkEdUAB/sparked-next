import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { zfd } from 'zod-form-data';
import { getDbFieldNamesConfigStatus } from '../config';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { SUBJECT_FIELD_NAMES_CONFIG } from './constants';
import { p_fetchSubjectWithGrade } from './pipelines';

export default async function fetchSubjects_(request: any) {
  const schema = zfd.formData({
    limit: zfd.numeric(),
    skip: zfd.numeric(),
    withMetaData: zfd.text().optional(),
  });
  const params = request.nextUrl.searchParams;

  const { limit, skip, withMetaData } = schema.parse(params);
  const isWithMetaData = Boolean(withMetaData);

  try {
    const db = await dbClient();

    if (!db) {
      const response = {
        isError: true,
        code: SPARKED_PROCESS_CODES.DB_CONNECTION_FAILED,
      };
      return new Response(JSON.stringify(response), {
        status: 200,
      });
    }

    let subjects = [];

    const dbConfigData = SUBJECT_FIELD_NAMES_CONFIG;

    const project = await getDbFieldNamesConfigStatus({ dbConfigData });

    if (isWithMetaData) {
      subjects = await db
        .collection(dbCollections.subjects.name)
        .aggregate(p_fetchSubjectWithGrade({ skip, limit, project }))
        .toArray();
    } else {
      subjects = await db
        .collection(dbCollections.subjects.name)
        .find(
          {},
          {
            limit,
            skip,
          },
        )
        .toArray();
    }

    const response = {
      isError: false,
      subjects,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
    });
  } catch (error) {
    const resp = {
      isError: true,
      code: SPARKED_PROCESS_CODES.UNKNOWN_ERROR,
    };

    return new Response(JSON.stringify(resp), {
      status: 200,
    });
  }
}
