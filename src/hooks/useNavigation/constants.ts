type T_axiosProcessStatus = {
  [key: string]: { code: number; message: string };
};

export const AXIOS_PROCESS_STATUS: T_axiosProcessStatus = {
  OK: {
    code: 200,
    message: "Request successful",
  },
  CREATED: {
    code: 201,
    message: "Resource created",
  },
  BAD_REQUEST: {
    code: 400,
    message: "Bad request",
  },
  UNAUTHORIZED: {
    code: 401,
    message: "Unauthorized",
  },
  NOT_FOUND: {
    code: 404,
    message: "Resource not found",
  },
  INTERNAL_SERVER_ERROR: {
    code: 500,
    message: "Internal server error",
  },
};
