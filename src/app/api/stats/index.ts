import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';

export default async function fetchCounts_() {
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

    const units = await db.collection(dbCollections.units.name).countDocuments();
    const grades = await db.collection(dbCollections.grades.name).countDocuments();
    const subjects = await db.collection(dbCollections.subjects.name).countDocuments();
    const topics = await db.collection(dbCollections.topics.name).countDocuments();
    const users = await db.collection(dbCollections.users.name).countDocuments();
    const pageViews = await db.collection(dbCollections.page_views.name).countDocuments();
    const mediaContent = await db.collection(dbCollections.media_content.name).countDocuments();
    const searches = await db.collection(dbCollections.searches.name).countDocuments();

    const stats = [
      {
        name: 'units',
        value: units,
      },
      {
        name: 'grades',
        value: grades,
      },
      {
        name: 'subjects',
        value: subjects,
      },
      {
        name: 'topics',
        value: topics,
      },
      {
        name: 'users',
        value: users,
      },
      {
        name: 'media_content',
        value: mediaContent,
      },
      {
        name: 'page_views',
        value: pageViews,
      },
      {
        name: 'searches',
        value: searches,
      },
    ];

    const response = {
      isError: false,
      stats,
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
      status: 500,
    });
  }
}
