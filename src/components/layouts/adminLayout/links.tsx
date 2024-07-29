import { T_MenuItemLink } from 'types/navigation/links';
import React from 'react';
import i18next from 'i18next';
import {
  AiOutlineBarChart,
  AiOutlineBlock,
  AiOutlineBook,
  AiOutlineBulb,
  AiOutlineContainer,
  AiOutlineDashboard,
  AiOutlineHdd,
  AiOutlineMessage,
  AiOutlineUser,
  AiOutlineSetting,
} from 'react-icons/ai';

// Todo:
// - Add logout link
// - Add profile details

export const ADMIN_LINKS: T_MenuItemLink = {
  home: {
    link: '/admin',
    roles: ['admin'],
    label: i18next.t('dashboard'),
    key: 'admin_home',
    icon: () => <AiOutlineDashboard />,
    index: 1,
  },
  settings: {
    link: '/admin/settings',
    roles: ['admin'],
    label: i18next.t('settings'),
    key: 'admin_settings',
    icon: () => <AiOutlineSetting />,
    index: 2,
    children: [
      {
        label: 'Pages',
        key: 'pages',
        link: '/admin/settings/pages',
        roles: ['admin'],
      },
      {
        label: 'Roles',
        key: 'roles',
        link: '/admin/settings/roles',
        roles: ['admin'],
      },
    ],
  },
  users: {
    link: '/admin/users',
    roles: ['admin'],
    label: i18next.t('users'),
    key: 'admin_users',
    icon: () => <AiOutlineUser />,
    index: 3,
  },
  // We won't need list of courses for now, This should be configurable in settings page
  // courses: {
  //   link: '/admin/courses',
  //   roles: ['admin'],
  //   label: i18next.t('courses'),
  //   key: 'admin_courses',
  //   icon: () => <AiOutlineBook />,
  //   index: 2,
  //   children: [
  //     {
  //       label: 'create',
  //       key: 'create',
  //       link: '/admin/courses/create',
  //       roles: ['admin'],
  //     },
  //     {
  //       label: 'edit',
  //       key: 'edit',
  //       link: '/admin/courses/edit',
  //       roles: ['admin'],
  //     },
  //   ],
  // },
  grades: {
    link: '/admin/grades',
    roles: ['admin'],
    label: i18next.t('grades'),
    key: 'admin_grades',
    icon: () => <AiOutlineBook />,
    index: 4,
  },
  subjects: {
    link: '/admin/subjects',
    roles: ['admin'],
    label: i18next.t('subjects'),
    key: 'admin_subjects',
    icon: () => <AiOutlineHdd />,
    index: 5,
  },
  topics: {
    link: '/admin/topics',
    roles: ['admin'],
    label: i18next.t('topics'),
    key: 'admin_topics',
    icon: () => <AiOutlineBulb />,
    index: 6,
  },
  // schools: {
  //   link: '/admin/schools',
  //   roles: ['admin'],
  //   label: i18next.t('schools'),
  //   key: 'admin_schools',
  //   icon: () => <AiOutlineHome />,
  //   index: 7,
  //   children: [
  //     {
  //       label: 'create',
  //       key: 'create',
  //       link: '/admin/schools/create',
  //       roles: ['admin'],
  //     },
  //     {
  //       label: 'edit',
  //       key: 'edit',
  //       link: '/admin/schools/edit',
  //       roles: ['admin'],
  //     },
  //   ],
  // },
  // programs: {
  //   link: '/admin/programs',
  //   roles: ['admin'],
  //   label: i18next.t('programs'),
  //   key: 'admin_programs',
  //   icon: () => <AiOutlineAppstoreAdd />,
  //   index: 8,
  //   children: [
  //     {
  //       label: 'create',
  //       key: 'create',
  //       link: '/admin/programs/create',
  //       roles: ['admin'],
  //     },
  //     {
  //       label: 'edit',
  //       key: 'edit',
  //       link: '/admin/programs/edit',
  //       roles: ['admin'],
  //     },
  //   ],
  // },
  units: {
    link: '/admin/units',
    roles: ['admin'],
    label: i18next.t('units'),
    key: 'admin_units',
    icon: () => <AiOutlineBlock />,
    index: 7,
  },
  media_content: {
    link: '/admin/media-content',
    roles: ['admin'],
    label: 'Media Content',
    key: 'admin_media-content',
    icon: () => <AiOutlineContainer />,
    index: 8,
  },
  statistics: {
    link: '/admin/statistics',
    roles: ['admin'],
    label: i18next.t('statistics'),
    key: 'admin_statistics',
    icon: () => <AiOutlineBarChart />,
    index: 9,
  },
  feedback: {
    link: '/admin/feedback',
    roles: ['admin'],
    label: i18next.t('feedback'),
    key: 'admin_feedback',
    icon: () => <AiOutlineMessage />,
    index: 10,
  },
};
