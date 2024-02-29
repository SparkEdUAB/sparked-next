import i18next from "i18next";
import { I_formFields } from "types/form";

export const CREATE_PROGRAM_FORM_FIELDS: I_formFields = {
  ["name"]: {
    label: i18next.t("name"),
    key: "name",
  },
  ["description"]: {
    label: i18next.t("description"),
    key: "description",
  },
  ["school"]: {
    label: i18next.t("school"),
    key: "schoolId",
  },
};
