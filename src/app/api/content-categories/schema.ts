import { zfd } from 'zod-form-data';

export const EDIT_CONTENT_CATEGORY_SCHEMA = zfd.formData({
  name: zfd.text(),
  contentCategoryId: zfd.text(),
  description: zfd.text().optional(),
});


export const DELETE_CONTENT_CATEGORIES_BY_ID_SCHEMA = zfd.formData({
  contentCategoryIds: zfd.repeatableOfType(zfd.text()),
});
