import { T_link } from '../types/navigation';

export const API_LINKS: T_link = {
  SIGNUP: '/api/authentication/signup',
  LOGIN: '/api/authentication/login',
  LOGOUT: '/api/authentication/logout',
  NEXT_AUTH_CREDENTIAL_LOGIN: '/api/auth/signin/credentials',
  // school links
  CREATE_SCHOOL: '/api/school/createSchool',
  FETCH_SCHOOLS: '/api/school/fetchSchools',
  FETCH_SCHOOL: '/api/school/fetchSchool',
  EDIT_SCHOOL: '/api/school/editSchool',
  DELETE_SCHOOLS: '/api/school/deleteSchools',
  FIND_SCHOOLS_BY_NAME: '/api/school/findSchoolsByName',
  // program links
  CREATE_PROGRAM: '/api/program/createProgram',
  FETCH_PROGRAMS: '/api/program/fetchPrograms',
  FETCH_PROGRAM_BY_ID: '/api/program/fetchProgramById',
  EDIT_PROGRAM: '/api/program/editProgram',
  DELETE_PROGRAMS: '/api/program/deletePrograms',
  FIND_PROGRAMS_BY_NAME: '/api/program/findProgramsByName',
  // course  links
  CREATE_COURSE: '/api/course/createCourse',
  FETCH_COURSES: '/api/course/fetchCourses',
  FETCH_COURSE_BY_ID: '/api/course/fetchCourseById',
  EDIT_COURSE: '/api/course/editCourse',
  DELETE_COURSES: '/api/course/deleteCourse',
  FIND_COURSE_BY_NAME: '/api/course/findCourseByName',
  // unit  links
  CREATE_UNIT: '/api/unit/createUnit',
  FETCH_UNITS: '/api/unit/fetchUnits',
  DELETE_UNITS: '/api/unit/deleteUnits',
  FETCH_UNIT_BY_ID: '/api/unit/fetchUnitById',
  FETCH_UNIT_BY_SUBJECT_ID: '/api/unit/fetchUnitBySubjectId',
  EDIT_UNIT: '/api/unit/editUnit',
  FIND_UNITS_BY_NAME: '/api/unit/findUnitsByName',

  //   topics
  CREATE_TOPIC: '/api/topic/createTopic',
  FETCH_TOPICS: '/api/topic/fetchTopics',
  DELETE_TOPICS: '/api/topic/deleteTopics',
  FETCH_TOPIC_BY_ID: '/api/topic/fetchTopicById',
  EDIT_TOPIC: '/api/topic/editTopic',
  FIND_TOPIC_BY_NAME: '/api/topic/findTopicsByName',

  //   grades
  CREATE_GRADE: '/api/grades/createGrade',
  FETCH_GRADES: '/api/grades/fetchGrades',
  DELETE_GRADES: '/api/grades/deleteGrades',
  FETCH_GRADE_BY_ID: '/api/grades/fetchGradeById',
  EDIT_GRADE: '/api/grades/editGrade',
  FIND_GRADE_BY_NAME: '/api/grades/findGradeByName',

  //   subjects
  CREATE_SUBJECT: '/api/subjects/createSubject',
  FETCH_SUBJECTS: '/api/subjects/fetchSubjects',
  DELETE_SUBJECTS: '/api/subjects/deleteSubjects',
  FETCH_SUBJECT_BY_ID: '/api/subjects/fetchSubjectById',
  FETCH_SUBJECTS_BY_GRADE_ID: '/api/subjects/fetchSubjectsByGradeId',
  EDIT_SUBJECT: '/api/subjects/editSubject',
  FIND_SUBJECT_BY_NAME: '/api/subjects/findSubjectByName',

  //   Categories
  CREATE_CATEGORY: '/api/category/createCategory',
  FETCH_CATEGORIES: '/api/category/fetchCategories',
  DELETE_CATEGORIES: '/api/category/deleteCategories',
  FETCH_CATEGORY_BY_ID: '/api/category/fetchCategoryById',
  EDIT_CATEGORY: '/api/category/editCategory',
  FIND_CATEGORY_BY_NAME: '/api/category/findCategoryByName',

  //   users
  CREATE_USER: '/api/users/createUser',

  //   Media content
  CREATE_MEDIA_CONTENT: '/api/media-content/createMediaContent',
  FETCH_MEDIA_CONTENT: '/api/media-content/fetchMediaContent',
  FETCH_RELATED_MEDIA_CONTENT: '/api/media-content/fetchRelatedMediaContent',
  DELETE_RESOURCES: '/api/media-content/deleteResources',
  FETCH_MEDIA_CONTENT_BY_ID: '/api/media-content/fetchMediaContentById',
  EDIT_MEDIA_CONTENT: '/api/media-content/editMediaContent',
  FIND_MEDIA_CONTENT_BY_NAME: '/api/media-content/findMediaContentByName',
  DELETE_MEDIA_CONTENT: '/api/media-content/deleteMediaContentByIds',
  FETCH_RANDOM_MEDIA_CONTENT: '/api/media-content/fetchRandomMediaContent',
  FETCH_MEDIA_TYPES: '/api/media-content/fetchMediaTypes',

  FETCH_ALL_STATS: '/api/stats/fetchCounts',

  //   SETTINGS > PAGE LINKS
  CREATE_PAGE_LINK: 'api/page-link/createPageLink',
  EDIT_PAGE_LINK: 'api/page-link/editPageLink',
  DELETE_PAGE_LINK: 'api/page-link/deletePageLink',

  //   resources
  FILE_UPLOAD: '/api/file-upload/uploadFile',
  READ_CONFIG_FILE: '/api/config/readConfigFile',
};
