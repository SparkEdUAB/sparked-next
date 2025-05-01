import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { BSON } from 'mongodb';
import { zfd } from 'zod-form-data';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { p_fetchUnitsWithMetaData } from './pipelines';
import { UNIT_FIELD_NAMES_CONFIG } from './constants';
import { getDbFieldNamesConfigStatus } from '../config';
import { T_RECORD } from 'types';
import { HttpStatusCode } from 'axios';
import { sortByNumericValue } from '../utils/sorting';

const dbConfigData = UNIT_FIELD_NAMES_CONFIG;

export default async function fetchUnits_(request: any) {
  const schema = zfd.formData({
    limit: zfd.numeric(),
    skip: zfd.numeric(),
    withMetaData: zfd.text().default('true').optional(),
  });
  const params = request.nextUrl.searchParams;

  const { limit, skip, withMetaData } = schema.parse(params);
  const isWithMetaData = withMetaData === 'true';

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

    let units = [];

    const project = await getDbFieldNamesConfigStatus({ dbConfigData });

    if (isWithMetaData) {
      units = await db
        .collection(dbCollections.units.name)
        .aggregate(p_fetchUnitsWithMetaData({ query: {}, limit, skip, project }))
        .toArray();
    } else {
      units = await db
        .collection(dbCollections.units.name)
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
      units: sortByNumericValue(units, 'name'),
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

export async function fetchUnitById_(request: any) {
  const schema = zfd.formData({
    unitId: zfd.text(),
    withMetaData: zfd.text().optional(), // this should boolean but changing for now to match the rest and FE
  });
  const params = request.nextUrl.searchParams;

  const { unitId, withMetaData } = schema.parse(params);
  const isWithMetaData = withMetaData === 'true';

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
    const project = await getDbFieldNamesConfigStatus({ dbConfigData });

    let unit: T_RECORD | null;

    if (isWithMetaData) {
      const units = await db
        .collection(dbCollections.units.name)
        .aggregate(
          p_fetchUnitsWithMetaData({
            project,
            query: {
              _id: new BSON.ObjectId(unitId),
            },
          }),
        )
        .toArray();

      unit = units.length ? units[0] : {};
    } else {
      unit = await db.collection(dbCollections.units.name).findOne({ _id: new BSON.ObjectId(unitId) });
    }

    const response = {
      isError: false,
      unit,
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

export async function deleteUnits_(request: Request) {
  const schema = zfd.formData({
    unitIds: zfd.repeatableOfType(zfd.text()),
  });
  const formBody = await request.json();

  const { unitIds } = schema.parse(formBody);

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

    const results = await db.collection(dbCollections.units.name).deleteMany({
      _id: {
        $in: unitIds.map((i) => new BSON.ObjectId(i)),
      },
    });

    const response = {
      isError: false,
      results,
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

export async function findUnitsByName_(request: any) {
  const schema = zfd.formData({
    name: zfd.text(),
    skip: zfd.numeric().optional(),
    limit: zfd.numeric().default(20).optional(),
    withMetaData: zfd.text().optional(),
  });
  const params = request.nextUrl.searchParams;

  const { name, limit, skip, withMetaData } = schema.parse(params);
  const isWithMetaData = withMetaData === 'true';

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
    const regexPattern = new RegExp(name, 'i');
    const project = await getDbFieldNamesConfigStatus({ dbConfigData });

    let units = null;

    if (isWithMetaData) {
      units = await db
        .collection(dbCollections.units.name)
        .aggregate(
          p_fetchUnitsWithMetaData({
            project,
            query: {
              name: { $regex: regexPattern },
            },
          }),
        )
        .toArray();
    } else {
      units = await db
        .collection(dbCollections.units.name)
        .find(
          {
            name: { $regex: regexPattern },
          },
          {
            limit,
            skip,
          },
        )
        .toArray();
    }

    const response = {
      isError: false,
      units,
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

export async function fetchUnitsBySubjectId_(request: any) {
  const schema = zfd.formData({
    subjectId: zfd.text(),
    withMetaData: zfd.text().optional(), // this should boolean but changing for now to match the rest and FE
  });
  const params = request.nextUrl.searchParams;

  const { subjectId, withMetaData } = schema.parse(params);
  const isWithMetaData = withMetaData === 'true';

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
    const project = await getDbFieldNamesConfigStatus({ dbConfigData });

    let units: T_RECORD[];

    if (isWithMetaData) {
      units = await db
        .collection(dbCollections.units.name)
        .aggregate(
          p_fetchUnitsWithMetaData({
            project,
            query: {
              subject_id: new BSON.ObjectId(subjectId),
            },
          }),
        )
        .toArray();
    } else {
      units = await db
        .collection(dbCollections.units.name)
        .find({ subject_id: new BSON.ObjectId(subjectId) })
        .toArray();
    }

    const response = {
      isError: false,
      units: sortByNumericValue(units, 'name'),
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
export async function fetchUnitsByTopicId_(request: any) {
  const schema = zfd.formData({
    topicId: zfd.text(),
    withMetaData: zfd.text().optional(), // this should boolean but changing for now to match the rest and FE
  });
  const params = request.nextUrl.searchParams;

  const { topicId, withMetaData } = schema.parse(params);
  const isWithMetaData = withMetaData === 'true';

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
    const project = await getDbFieldNamesConfigStatus({ dbConfigData });

    let units: T_RECORD[];

    if (isWithMetaData) {
      units = await db
        .collection(dbCollections.units.name)
        .aggregate(
          p_fetchUnitsWithMetaData({
            project,
            query: {
              topic_id: new BSON.ObjectId(topicId),
            },
          }),
        )
        .toArray();
    } else {
      units = await db
        .collection(dbCollections.units.name)
        .find({ topic_id: new BSON.ObjectId(topicId) })
        .toArray();
    }

    const response = {
      isError: false,
      units: sortByNumericValue(units, 'name'),
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

export async function fetchUnitsByGradeId_(request: any) {
  const schema = zfd.formData({
    gradeId: zfd.text(),
    withMetaData: zfd.text().optional(), // this should boolean but changing for now to match the rest and FE
  });
  const params = request.nextUrl.searchParams;

  const { gradeId, withMetaData } = schema.parse(params);
  const isWithMetaData = withMetaData === 'true';

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
    const project = await getDbFieldNamesConfigStatus({ dbConfigData });

    let units: T_RECORD[];

    if (isWithMetaData) {
      units = await db
        .collection(dbCollections.units.name)
        .aggregate(
          p_fetchUnitsWithMetaData({
            project,
            query: {
              grade_id: new BSON.ObjectId(gradeId),
            },
          }),
        )
        .toArray();
    } else {
      units = await db
        .collection(dbCollections.units.name)
        .find({ grade_id: new BSON.ObjectId(gradeId) })
        .toArray();
    }

    const response = {
      isError: false,
      units: sortByNumericValue(units, 'name'),
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
