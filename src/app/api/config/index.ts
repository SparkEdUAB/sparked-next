import 'server-only';
import { CONFIG_CORE_PATH } from '@hooks/use-config/constants';
import fs from 'fs';
const fsPromises = fs.promises;

import CONFIG_PROCESS_CODES from './processCodes';
import { T_CONFIG_DB_VARIABLE, T_CONFIG_VARIABLES } from 'types/config';
import { HttpStatusCode } from 'axios';

export default async function readConfigFile_() {
  const configData = await getConfigFile();

  try {
    const response = {
      isError: false,
      configData: JSON.parse(configData),
      code: CONFIG_PROCESS_CODES.FILE_READ,
    };

    return new Response(JSON.stringify(response), {
      status: HttpStatusCode.Ok,
    });
  } catch {
    const response = {
      isError: true,
      code: CONFIG_PROCESS_CODES.READING_FILE_FAILED,
    };
    return new Response(JSON.stringify(response), {
      status: HttpStatusCode.InternalServerError,
    });
  }
}

const getConfigFile = async () => {
  const filePath = `${process.cwd()}/${CONFIG_CORE_PATH}`;

  return await fsPromises.readFile(filePath, 'utf8');
};

/** getQueryConfigItemsStatus
 * Checks the status of the config. Best for determining if an item should be included in the payload to the client
 *
 * @param configKeys keys to check against the config file
 */
export async function getDbFieldNamesConfigStatus({ dbConfigData }: { dbConfigData: T_CONFIG_DB_VARIABLE[] }) {
  const configData = JSON.parse(await getConfigFile()) as T_CONFIG_VARIABLES;

  const enabledKeys = new Set(
    Object.values(configData)
      .filter((entry) => entry.value === 'true')
      .map((entry) => entry.key),
  );

  return Object.fromEntries(
    dbConfigData.filter((field) => field.key && enabledKeys.has(field.key)).map((field) => [field.fieldName, 1]),
  );
}
