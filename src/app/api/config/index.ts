import { CONFIG_CORE_PATH } from '@hooks/use-config/constants';
import fs from 'fs';
import { T_RECORD } from 'types';
import CONFIG_PROCESS_CODES from './processCodes';
import { T_CONFIG_DB_VARIABLE, T_CONFIG_VARIABLE, T_CONFIG_VARIABLES } from 'types/config';
import { HttpStatusCode } from 'axios';

const fsPromises = fs.promises;

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
  return {};
  const configData = JSON.parse(await getConfigFile()) as T_CONFIG_VARIABLES;

  const configItems: T_CONFIG_DB_VARIABLE[] = [];

  const configKeys = dbConfigData.map((i) => i.key);

  // let arrIndex = 0;

  for (const key in configData) {
    //@ts-ignore
    const entry = configData[key] as T_CONFIG_VARIABLE;

    if (configKeys.includes(entry.key) && entry.value  === 'true') {
      configItems.push({
        value: entry.value  === 'true' ? 1 : 0,
        fieldName: dbConfigData[configKeys.indexOf(entry.key)]?.fieldName,
      });
    }

    // arrIndex++;
  }

  return configItems.map((i) => ({ [i.fieldName]: i.value } as T_RECORD)).reduce((a, c) => ({ ...a, ...c }));
}
