import i18next from "i18next";
import { T_ResourceFormFields } from "types/resources";

export const RESOURCE_FORM_FIELDS: T_ResourceFormFields = {
  name: {
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
  ["program"]: {
    label: i18next.t("Program"),
    key: "programId",
  },
  ["course"]: {
    label: i18next.t("course"),
    key: "courseId",
  },
  ["unit"]: {
    label: i18next.t("units"),
    key: "unitId",
  },
  ["topic"]: {
    label: i18next.t("topic"),
    key: "topicId",
  },
};
