import i18next from "i18next";
import { IformFields } from "types/form";

export const SIGNUP_FORM_FIELDS: IformFields = {
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
