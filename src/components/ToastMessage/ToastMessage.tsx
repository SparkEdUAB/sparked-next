import React from 'react';
import { Toast } from 'flowbite-react';
import { HiCheck, HiExclamation, HiX } from 'react-icons/hi';
import { IoInformation } from 'react-icons/io5';

interface ToastMessageProps {
  id: number;
  content: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

const ToastMessage: React.FC<ToastMessageProps> = ({ content, type }) => {
  return (
    <Toast color={type} className="animate-appear bg-white dark:bg-white p-3">
      <div
        className={
          'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md ' +
          (type === 'success'
            ? 'bg-green-100 text-green-500 dark:bg-green-100 dark:text-green-500'
            : type === 'warning'
            ? 'bg-orange-100 text-orange-500 dark:bg-orange-100 dark:text-orange-500'
            : type === 'error'
            ? 'bg-red-100 text-red-500 dark:bg-red-100 dark:text-red-500'
            : type === 'info' && 'bg-cyan-100 text-cyan-500 dark:bg-cyan-100 dark:text-cyan-600')
        }
      >
        {type === 'error' ? (
          <HiX className="h-5 w-5" />
        ) : type === 'success' ? (
          <HiCheck className="h-5 w-5" />
        ) : type === 'warning' ? (
          <HiExclamation className="h-5 w-5" />
        ) : (
          type === 'info' && <IoInformation className="h-5 w-5" />
        )}
      </div>
      <div className="ml-3 text-sm text-black font-normal">{content}</div>
      <Toast.Toggle className="dark:bg-white dark:text-gray-400 dark:hover:bg-gray-100 dark:hover:text-gray-900" />
    </Toast>
  );
};

export default ToastMessage;
