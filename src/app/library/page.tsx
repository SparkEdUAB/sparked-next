'use client';

import React, { useState } from 'react';
import LibraryLayout from '@components/layouts/library';
import { bookTitles } from '@components/layouts/library/book-titles';
import ContentCardView from '@components/layouts/library/content-card';
import { Badge, Button, Label, Modal, Select } from 'flowbite-react';
import { libraryTags } from '@components/layouts/library/tags';
import { HiFilter } from 'react-icons/hi';
import { RiFilter2Fill } from 'react-icons/ri';
import { test_fetchRandomMediaContent } from 'app/_tests_/api/content';

const LibraryPage: React.FC = (props) => {
  const [filtering, setFiltering] = useState(false);

  test_fetchRandomMediaContent();

  return (
    <main>
      <div className="overflow-x-scroll flex flex-row gap-2">
        <Badge key={'All'} className="h-full" href="#">
          All
        </Badge>
        {libraryTags.map((tag) => (
          <Badge key={tag} className="h-full" href="#" color="gray">
            {tag}
          </Badge>
        ))}
      </div>
      <div className="grid py-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {new Array(20).fill('i').map((i, index) => (
          <div style={{ padding: '8px 0' }} key={index} className="gutter-row px-2">
            <ContentCardView title={bookTitles[index]} />
          </div>
        ))}
      </div>
      <FilteringModal filtering={filtering} setFiltering={setFiltering} />
    </main>
  );
};

export default LibraryPage;

function FilteringModal({
  filtering,
  setFiltering,
}: {
  filtering: boolean;
  setFiltering: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Modal show={filtering} onClose={() => setFiltering(false)} dismissible position="center">
      <Modal.Header>
        <h1 className="text-3xl font-semibold text-gray-700 dark:text-gray-300">Filter</h1>
      </Modal.Header>
      <Modal.Body>
        <table>
          <tr>
            <td>
              <Label htmlFor="school" value="School:" />
            </td>
            <td>
              <Select />
            </td>
          </tr>
        </table>
      </Modal.Body>
    </Modal>
  );
}
