import { zfd } from 'zod-form-data';

export const EDIT_CONTENT_CATEGORY_SCHEMA = zfd.formData({
  name: zfd.text(),
  contentCategoryId: zfd.text(),
  description: zfd.text().optional(),
});
