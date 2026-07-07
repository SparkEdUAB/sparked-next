import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { HttpStatusCode } from 'axios';
import { buildScopedQuery } from '../lib/organization';
import { Session } from 'next-auth';

export default async function fetchCounts_(_request?: Request, session?: Session) {
  try {
    const db = await dbClient();

    if (!db) {
      const response = {
        isError: true,
        code: SPARKED_PROCESS_CODES.DB_CONNECTION_FAILED,
      };
      return new Response(JSON.stringify(response), {
        status: HttpStatusCode.InternalServerError,
      });
    }

    const unitQuery = await buildScopedQuery(db, session, {}, { includeLegacyUnscopedForDefault: true });
    const userQuery = await buildScopedQuery(db, session, {}, { includeLegacyUnscopedForDefault: true });
    const institutionQuery = await buildScopedQuery(db, session, {}, { includeLegacyUnscopedForDefault: true });

    const units = await db.collection(dbCollections.units.name).countDocuments(unitQuery);
    const grades = await db.collection(dbCollections.grades.name).countDocuments(unitQuery);
    const subjects = await db.collection(dbCollections.subjects.name).countDocuments(unitQuery);
    const topics = await db.collection(dbCollections.topics.name).countDocuments(unitQuery);
    const users = await db.collection(dbCollections.users.name).countDocuments(userQuery);
    const pageViews = await db.collection(dbCollections.page_views.name).countDocuments(unitQuery);
    const mediaContent = await db.collection(dbCollections.media_content.name).countDocuments(unitQuery);
    const searches = await db.collection(dbCollections.searches.name).countDocuments(unitQuery);
    const institutions = await db.collection(dbCollections.institutions.name).countDocuments(institutionQuery);
    const verifiedInstitutions = await db.collection(dbCollections.institutions.name).countDocuments({ is_verified: true });
    const unassignedUsers = await db.collection(dbCollections.users.name).countDocuments({
      $and: [
        userQuery,
        {
          $or: [{ organization_id: { $exists: false } }, { organization_id: null }],
        },
      ],
    });

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
      {
        name: 'institutions',
        value: institutions,
      },
      {
        name: 'verified_institutions',
        value: verifiedInstitutions,
      },
      {
        name: 'unassigned_users',
        value: unassignedUsers,
      },
    ];

    const response = {
      isError: false,
      stats,
    };

    return new Response(JSON.stringify(response), {
      status: HttpStatusCode.Ok,
    });
  } catch {
    const resp = {
      isError: true,
      code: SPARKED_PROCESS_CODES.UNKNOWN_ERROR,
    };

    return new Response(JSON.stringify(resp), {
      status: HttpStatusCode.InternalServerError,
    });
  }
}
