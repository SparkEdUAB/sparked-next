import { translate } from "utils/intl";
import { WORDS } from "utils/intl/data/constants";
import { IsignupFormFields } from "./types";



export const SIGNUP_FORM_FIELDS: IsignupFormFields = {
  [WORDS.email]: {
    label: translate(WORDS.email),
    key: "email",
    errorMsg: translate(WORDS.email_error),
  },

  [WORDS.password]: {
    label: translate(WORDS.password),
    key: "password",
    errorMsg: translate(WORDS.password_error),
  },
};