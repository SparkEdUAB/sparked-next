'use client';

import CreateCourseView from '@components/courses/createCourseView';
import React from 'react';

const CreateProgram = ({ params: { lng } }: { params: { lng: string } }) => {
  return <CreateCourseView />;
};

export default CreateProgram;
