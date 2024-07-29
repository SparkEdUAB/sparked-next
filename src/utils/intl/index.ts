import { DEBUG } from 'app/shared/constants';
import i18next from 'i18next';

i18next.init({
  lng: 'en', // if you're using a language detector, do not define the lng option
  debug: DEBUG,
  saveMissing: true,
  resources: {
    en: {
      translation: {
        home: 'Home',
        signup: 'Sign Up',
        signin: 'Sign In',
        email: 'Email',
        password: 'Password',
        form: 'Form',
        email_error: 'Please input your email',
        password_error: 'Please input your password!',
        unknown_error: 'Sorry, something went wrong',
        user_created: 'Account successfully created',
        user_exist: 'Sorry account already exits',
        user_exist2: 'Sorry account already exits. Please sign in',
        logged_in: 'You are now logged in',
        login_signup: 'Login | Sign up',
        resources: 'Resources',
        about_us: 'About Us',
        logout: 'Logout',
        logout_ok: 'You are now logged out',
        logout_failed: 'Sorry failed to logout, please try again',
        app_beta_note:
          "🚀 Get ready to embark on an educational journey like never before with Sparked Next, the evolution of modern learning! We're thrilled to unveil the next chapter of our educational app, and it's packed with innovative features and enhancements that will elevate your learning experience.",
        admin: 'Admin',
        courses: 'Courses',
        dashboard: 'Dashboard',
        yes_im_sure: "Yes, I'm sure",
        no_cancel: 'No, cancel',
        deletion_confirmation_singular: 'Are you sure you want to delete this item?',
        deletion_confirmation_plural: 'Are you sure you want to delete these items?',

        create_unit: 'Create a New Unit',
        create_user: 'Create a New User',
        create_topic: 'Create a New Topic',
        create_school: 'Create a New School',
        create_course: 'Create a New Course',
        create_grade: 'Create a New Grade',
        create_program: 'Create a New Program',
        create_resource: 'Create a New Resource',
        create_subject: 'Create a New Subject',
        create_page: 'Create a New Page',
        create_role: 'Create a New Role',

        edit_unit: 'Edit Unit',
        edit_user: 'Edit a User',
        edit_topic: 'Edit Topic',
        edit_school: 'Edit a School',
        edit_course: 'Edit Course',
        edit_subject: 'Edit Subject',
        edit_grade: 'Edit Grade',
        edit_program: 'Edit a Program',
        edit_media_content: 'Edit Media Content',
        edit_page: 'Edit a Page',
        edit_role: 'Edit a Role',

        unit_created: 'Unit created successfully',
        topic_created: 'Topic created successfully',
        school_created: 'School created successfully',
        course_created: 'Course created successfully',
        grade_created: 'Grade created successfully',
        subject_created: 'Subject created successfully',
        program_created: 'Program created successfully',
        resource_created: 'Resource created successfully',

        topics_found: 'topics found',
        media_content_found: 'media content found',
        units_found: 'units found',
        programs_found: 'programs found',
        schools_found: 'schools found',
        users_found: 'users found',
        grade_found: 'grade found',
        subject_found: 'subject found',

        search_items: 'Search Items',

        name: 'Name',
        description: 'Description',
        page_link: 'Page Link',
        school: 'School',
        program: 'Program',
        course: 'Course',
        topic: 'Topic',
        grade: 'Grade',

        submit: 'Submit',
        upload: 'Upload',
        update: 'Update',
        upload_file: 'Upload File',
        upload_thumbnail: 'Upload Thumbnail (optional)',

        settings: 'Settings',
        users: 'Users',
        units: 'Units',
        topics: 'Topics',
        schools: 'Schools',
        programs: 'Programs',
        media_content: 'Media Content',
        statistics: 'Statistics',
        feedback: 'Feedback',
        grades: 'Grades',
        subjects: 'Subjects',
        roles: 'Roles',
        pages: 'Pages',

        new: 'New',
        delete: 'Delete',
        upload_multiple: 'Upload Multiple',
        next: 'Next',
        step_1_select_topic: 'Step 1: Select Topic',
        step_2_select_files: 'Step 2: Select Files',
        step_3_edit_resources: 'Step 3: Edit Resource Data',

        select_items: 'Select some items',
        select_one_item: 'Select one item',
        search_empty: 'Please enter some search text',
        wait: 'Please wait for the current operation to complete',
        success: 'The operation was successfully completed',
        no_file: 'No file was provided',
        failed_to_upload: 'Failed to upload',
        failed_with_error_code: 'The operation failed with an error code',
        fill_required_fields: 'Please fill in all required fields',
        page_views: 'Page Views',
        searches: 'Searches',

        most_viewed: 'Most Viewed',
        newest: 'Newest',
        sort_by: 'Sort By',

        // General process codes
        process_code_100: 'An unknown error occurred',
        process_code_101: 'The specified API method was not found',
        process_code_102: 'The database connection failed',

        // Auth process codes
        process_code_500: 'User already exists',
        process_code_501: 'An unknown error occurred',
        process_code_502: 'User not found',
        process_code_503: 'User logged in successfully',
        process_code_504: 'Invalid credentials',
        process_code_505: 'User logged out successfully',
        process_code_506: 'User already exists',
        process_code_507: 'User was successfully created',

        // School process codes
        process_code_800: 'School already exists',
        process_code_801: 'School not found',
        process_code_802: 'School edited successfully',
        process_code_803: 'School created successfully',

        // Program process codes
        process_code_1000: 'Program already exists',
        process_code_1001: 'Program not found',
        process_code_1002: 'Program edited successfully',
        process_code_1003: 'Program created successfully',
        process_code_1004: 'School not found',

        // Course process codes
        process_code_1200: 'Course already exists',
        process_code_1201: 'Course not found',
        process_code_1202: 'Course edited successfully',
        process_code_1203: 'Course created successfully',
        process_code_1204: 'School not found',
        process_code_1205: 'Program not found',

        // Unit process codes
        process_code_1400: 'Unit already exists',
        process_code_1401: 'Course not found',
        process_code_1402: 'Unit edited successfully',
        process_code_1403: 'Unit created successfully',
        process_code_1404: 'School not found',
        process_code_1405: 'Program not found',
        process_code_1406: 'Unit not found',

        // Topic process codes
        process_code_1600: 'Topic already exists',
        process_code_1601: 'Course not found',
        process_code_1602: 'Topic edited successfully',
        process_code_1603: 'Topic created successfully',
        process_code_1604: 'School not found',
        process_code_1605: 'Program not found',
        process_code_1606: 'Topic not found',
        process_code_1607: 'Subject not found',
        process_code_1608: 'Grade not found',

        // Media process codes
        process_code_2100: 'Resource already exists',
        process_code_2101: 'Course not found',
        process_code_2102: 'Resource edited successfully',
        process_code_2103: 'Resource created successfully',
        process_code_2104: 'School not found',
        process_code_2105: 'Program not found',
        process_code_2106: 'Resource not found',
        process_code_2107: 'Unit not found',
        process_code_2108: 'Topic not found',
        process_code_2109: 'Media content not found',
        process_code_2110: 'Media content edited successfully',

        // File process codes
        process_code_2600: 'Media uploaded successfully',
        process_code_2601: 'Media upload failed',

        // Stats Process codes (3000 - 3499)

        // Config process codes
        process_code_4000: 'Failed to read config file',
        process_code_4001: 'The file was read successfully',

        // Grade process codes
        process_code_5000: 'Grade already exists',
        process_code_5001: 'Grade not found',
        process_code_5002: 'Grade edited successfully',
        process_code_5003: 'Grade created successfully',
        process_code_5004: 'Grade deleted successfully',

        // Subject process codes
        process_code_6000: 'Subject already exists',
        process_code_6001: 'Subject not found',
        process_code_6002: 'Subject edited successfully',
        process_code_6003: 'Subject created successfully',
        process_code_6004: 'Subject deleted successfully',

        // User process codes
        process_code_6500: 'User already exists',
        process_code_6501: 'User not found',
        process_code_6502: 'User edited successfully',
        process_code_6503: 'User created successfully',
        process_code_6504: 'Users deleted successfully',

        // Page action process codes
        process_code_7000: 'Page action already exists',
        process_code_7001: 'Page action not found',
        process_code_7002: 'Page action edited successfully',
        process_code_7003: 'Page action created successfully',
        process_code_7004: 'Page actions deleted successfully',

        // Page link process codes
        process_code_7500: 'Page link already exists',
        process_code_7501: 'Page link not found',
        process_code_7502: 'Page link edited successfully',
        process_code_7503: 'Page link created successfully',
        process_code_7504: 'Page links deleted successfully',
        process_code_7505: 'Page action already linked',
        process_code_7506: 'Page action linked',
        process_code_7507: 'Page action not found',
        process_code_7508: 'Page action unlinked',

        // User role process codes
        process_code_8500: 'User role already exists',
        process_code_8501: 'User role not found',
        process_code_8502: 'User role edited successfully',
        process_code_8503: 'User role created successfully',
        process_code_8504: 'User roles deleted successfully',
        process_code_8505: 'User role assigned successfully',
      },
    },
  },
});
