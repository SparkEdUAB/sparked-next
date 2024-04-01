'use client';

import React, { useState } from 'react';
import { Label, Modal, Select } from 'flowbite-react';

export function FilteringModal() {
  const [filtering, setFiltering] = useState(false);

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
