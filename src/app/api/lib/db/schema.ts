import Realm from "realm";

export type bookmarks = {
  _id: Realm.BSON.ObjectId;
  color: string;
  created_at: Date;
  description: string;
  resource_id: Realm.BSON.ObjectId;
  title: string;
  updated_at?: Date;
  user_id: Realm.BSON.ObjectId;
};

export const bookmarksSchema = {
  name: "bookmarks",
  properties: {
    _id: "objectId",
    color: "string",
    created_at: "date",
    description: "string",
    resource_id: "objectId",
    title: "string",
    updated_at: "date?",
    user_id: "objectId",
  },
  primaryKey: "_id",
};

export type course_topics = {
  _id: Realm.BSON.ObjectId;
  created_at: Date;
  created_by_id: Realm.BSON.ObjectId;
  description: string;
  name: string;
  updated_at?: Date;
  updated_by_id?: Realm.BSON.ObjectId;
};

export const course_topicsSchema = {
  name: "course_topics",
  properties: {
    _id: "objectId",
    created_at: "date",
    created_by_id: "objectId",
    description: "string",
    name: "string",
    updated_at: "date?",
    updated_by_id: "objectId?",
  },
  primaryKey: "_id",
};

export type courses = {
  _id: Realm.BSON.ObjectId;
  code: string;
  created_at: Date;
  created_by_id: Realm.BSON.ObjectId;
  institution_id?: Realm.BSON.ObjectId;
  is_visible?: boolean;
  languages: Realm.List<courses_languages>;
  name: string;
  program_id?: Realm.BSON.ObjectId;
  school_id?: Realm.BSON.ObjectId;
  updated_at?: Date;
  updated_by_id?: Realm.BSON.ObjectId;
};

export const coursesSchema = {
  name: "courses",
  properties: {
    _id: "objectId",
    code: "string",
    created_at: "date",
    created_by_id: "objectId",
    institutions_id: "objectId?",
    is_visible: "bool?",
    languages: "courses_languages []",
    name: "string",
    program_id: "objectId?",
    school_id: "objectId?",
    updated_at: "date?",
    updated_by_id: "objectId?",
  },
  primaryKey: "_id",
};

export type courses_languages = {
  language_id?: string;
};

export const courses_languagesSchema = {
  name: "courses_languages ",
  embedded: true,
  properties: {
    language_id: "string?",
  },
};

export type feed_back = {
  _id?: Realm.BSON.ObjectId;
  attachment_link?: string;
  created_at?: Date;
  message?: string;
  reported_by_id?: Realm.BSON.ObjectId;
  updated_at?: Date;
};

export const feed_backSchema = {
  name: "feed_back",
  properties: {
    _id: "objectId?",
    attachment_link: "string?",
    created_at: "date?",
    message: "string?",
    reported_by_id: "objectId?",
    updated_at: "date?",
  },
  primaryKey: "_id",
};

export type languages = {
  _id?: Realm.BSON.ObjectId;
  code?: string;
  label?: string;
  name?: string;
};

export const languagesSchema = {
  name: "languages",
  properties: {
    _id: "objectId?",
    code: "string?",
    label: "string?",
    name: "string?",
  },
  primaryKey: "_id",
};

export const schoolSchema = {
  name: "school",
  properties: {
    _id: "objectId?",
    description: "string?",
    name: "string?",
  },
  primaryKey: "_id",
};


export const schoolsSchema = {
  name: "schools",
  properties: {
    _id: "objectId",
    created_at: "date",
    created_by_id: "objectId",
    description: "string",
    name: "string",
    updated_at: "date?",
    updated_by_id: "objectId?",
  },
  primaryKey: "_id",
};


export type preferences = {
  _id: Realm.BSON.ObjectId;
  created_at?: Date;
  created_by_id?: Realm.BSON.ObjectId;
  description?: string;
  title?: string;
  updated_at?: Date;
  updated_by_id?: Date;
};

export const preferencesSchema = {
  name: "preferences",
  properties: {
    _id: "objectId",
    created_at: "date?",
    created_by_id: "objectId?",
    description: "string?",
    title: "string?",
    updated_at: "date?",
    updated_by_id: "date?",
  },
  primaryKey: "_id",
};

export type settings = {
  _id: Realm.BSON.ObjectId;
  created_at: Date;
  created_by_id: Realm.BSON.ObjectId;
  description?: string;
  title: string;
  upated_at?: Date;
  updated_by_id?: Realm.BSON.ObjectId;
};

export const settingsSchema = {
  name: "settings",
  properties: {
    _id: "objectId",
    created_at: "date",
    created_by_id: "objectId",
    description: "string?",
    title: "string",
    upated_at: "date?",
    updated_by_id: "objectId?",
  },
  primaryKey: "_id",
};

export type user_permissions = {
  _id: Realm.BSON.ObjectId;
  created_at: Date;
  created_by_id: Realm.BSON.ObjectId;
  description?: string;
  label: string;
  name: string;
  updated_at?: Date;
  updated_by_id?: Realm.BSON.ObjectId;
};

export const user_permissionsSchema = {
  name: "user_permissions",
  properties: {
    _id: "objectId",
    created_at: "date",
    created_by_id: "objectId",
    description: "string?",
    label: "string",
    name: "string",
    updated_at: "date?",
    updated_by_id: "objectId?",
  },
  primaryKey: "_id",
};

export type user_roles = {
  _id?: Realm.BSON.ObjectId;
  created_by_id?: Realm.BSON.ObjectId;
  created_at?: Date;
  description?: string;
  label?: string;
  name?: string;
  permission_ids: Realm.List<user_permissions>;
  updated_at?: Date;
  updated_by_id?: Realm.BSON.ObjectId;
};

export const user_rolesSchema = {
  name: "user_roles",
  properties: {
    _id: "objectId?",
    created_by_id: "objectId?",
    created_at: "date?",
    description: "string?",
    label: "string?",
    name: "string?",
    permission_ids: "user_permissions[]",
    updated_at: "date?",
    updated_by_id: "objectId?",
  },
  primaryKey: "_id",
};

export const programsSchema = {
  name: "programs",
  properties: {
    _id: "objectId",
    created_at: "date",
    created_by_id: "objectId",
    description: "string",
    name: "string",
    school_id: "objectId",
    updated_at: "date?",
    updated_by_id: "objectId?",
  },
  primaryKey: "_id",
};
