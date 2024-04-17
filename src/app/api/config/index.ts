import { CONFIG_CORE_PATH } from '@hooks/use-config/constants';
import fs from 'fs';
import { Session } from 'next-auth';
import CONFIG_PROCESS_CODES from './processCodes';

const fsPromises = fs.promises;

export default async function readConfigFile_(req: Request, session?: Session) {
  try {
    const filePath = `${process.cwd()}/${CONFIG_CORE_PATH}`;

    const configFile = await fsPromises.readFile(filePath, 'utf8');

    const response = {
      isError: false,
      configFile,
      code: CONFIG_PROCESS_CODES.FILE_READ,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
    });
  } catch (error) {
    const response = {
      isError: true,
      code: CONFIG_PROCESS_CODES.READING_FILE_FAILED,
    };
    return new Response(JSON.stringify(response), {
      status: 200,
    });
  }
}
