import i18next from "i18next";
import { IformFields } from "types/form";

export const CREATE_SCHOOL_FORM_FIELDS: IformFields = {
  ["name"]: {
    label: i18next.t("name"),
    key: "name",
  },
  ["description"]: {
    label: i18next.t("description"),
    key: "description",
  },
};
