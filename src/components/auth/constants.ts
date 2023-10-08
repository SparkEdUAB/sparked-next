import { IsignupFormFields } from "./types";
import i18next from "i18next";

export const SIGNUP_FORM_FIELDS: IsignupFormFields = {
  ["email"]: {
    label: i18next.t("email"),
    key: "email",
    errorMsg: i18next.t("email_error"),
  },

  ["password"]: {
    label: i18next.t("password"),
    key: "password",
    errorMsg: i18next.t("password_error"),
  },
};
