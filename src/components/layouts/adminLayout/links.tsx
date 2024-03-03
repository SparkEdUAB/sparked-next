import { TmenuItemLink } from 'types/links';
import React from 'react';
import {
  DashboardOutlined,
  UserOutlined,
  BookOutlined,
  BulbOutlined,
  BarChartOutlined,
  MessageOutlined,
  HomeOutlined,
  AppstoreAddOutlined,
  BlockOutlined,
  ContainerOutlined,
} from '@ant-design/icons';
import i18next from 'i18next';

// Todo:
// - Add logout link
// - Add profile details

export const ADMIN_LINKS: TmenuItemLink = {
  home: {
    link: '/admin',
    roles: ['admin'],
    label: i18next.t('dashboard'),
    key: 'admin_home',
    icon: () => <DashboardOutlined />,
    index: 0,
  },
  users: {
    link: '/admin/users',
    roles: ['admin'],
    label: i18next.t('users'),
    key: 'admin_users',
    icon: () => <UserOutlined />,
    index: 2,
    children: [
      {
        label: 'create',
        key: 'create',
        link: '/admin/users/create',
        roles: ['admin'],
      },
      {
        label: 'edit',
        key: 'edit',
        link: '/admin/users/edit',
        roles: ['admin'],
      },
    ],
  },
  courses: {
    link: '/admin/courses',
    roles: ['admin'],
    label: i18next.t('courses'),
    key: 'admin_courses',
    icon: () => <BookOutlined />,
    index: 2,
    children: [
      {
        label: 'create',
        key: 'create',
        link: '/admin/courses/create',
        roles: ['admin'],
      },
      {
        label: 'edit',
        key: 'edit',
        link: '/admin/courses/edit',
        roles: ['admin'],
      },
    ],
  },
  topics: {
    link: '/admin/topics',
    roles: ['admin'],
    label: i18next.t('topics'),
    key: 'admin_topics',
    icon: () => <BulbOutlined />,
    index: 3,
    children: [
      {
        label: 'create',
        key: 'create',
        link: '/admin/topics/create',
        roles: ['admin'],
      },
      {
        label: 'edit',
        key: 'edit',
        link: '/admin/topics/edit',
        roles: ['admin'],
      },
    ],
  },
  schools: {
    link: '/admin/schools',
    roles: ['admin'],
    label: i18next.t('schools'),
    key: 'admin_schools',
    icon: () => <HomeOutlined />,
    index: 7,
    children: [
      {
        label: 'create',
        key: 'create',
        link: '/admin/schools/create',
        roles: ['admin'],
      },
      {
        label: 'edit',
        key: 'edit',
        link: '/admin/schools/edit',
        roles: ['admin'],
      },
    ],
  },
  programs: {
    link: '/admin/programs',
    roles: ['admin'],
    label: i18next.t('programs'),
    key: 'admin_programs',
    icon: () => <AppstoreAddOutlined />,
    index: 8,
    children: [
      {
        label: 'create',
        key: 'create',
        link: '/admin/programs/create',
        roles: ['admin'],
      },
      {
        label: 'edit',
        key: 'edit',
        link: '/admin/programs/edit',
        roles: ['admin'],
      },
    ],
  },
  units: {
    link: '/admin/units',
    roles: ['admin'],
    label: i18next.t('units'),
    key: 'admin_units',
    icon: () => <BlockOutlined />,
    index: 9,
    children: [
      {
        label: 'create',
        key: 'create',
        link: '/admin/units/create',
        roles: ['admin'],
      },
      {
        label: 'edit',
        key: 'edit',
        link: '/admin/units/edit',
        roles: ['admin'],
      },
    ],
  },
  media_content: {
    link: '/admin/media-content',
    roles: ['admin'],
    label: 'Media Content',
    key: 'admin_media-content',
    icon: () => <ContainerOutlined />,
    index: 9,
    children: [
      {
        label: 'create',
        key: 'create',
        link: '/admin/media-content/create',
        roles: ['admin'],
      },
      {
        label: 'edit',
        key: 'edit',
        link: '/admin/media-content/edit',
        roles: ['admin'],
      },
    ],
  },
  statistics: {
    link: '/statistics',
    roles: ['admin'],
    label: i18next.t('statistics'),
    key: 'admin_statistics',
    icon: () => <BarChartOutlined />,
    index: 5,
  },
  feedback: {
    link: '/feedback',
    roles: ['admin'],
    label: i18next.t('feedback'),
    key: 'admin_feedback',
    icon: () => <MessageOutlined />,
    index: 6,
  },
};
