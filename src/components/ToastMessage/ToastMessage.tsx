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
    <Toast 
      color={type} 
      className="animate-appear bg-white dark:bg-[#202020] p-3 flex items-start max-w-[300px] mx-auto"
    >
      <div className="flex items-start w-full">
        <div
          className={
            'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md mt-1 ' +
            (type === 'success'
              ? 'bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-300'
              : type === 'warning'
                ? 'bg-orange-100 text-orange-500 dark:bg-orange-800 dark:text-orange-300'
                : type === 'error'
                  ? 'bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-300'
                  : type === 'info' && 'bg-cyan-100 text-cyan-600 dark:bg-cyan-800 dark:text-cyan-300')
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
        <div className="ml-3 text-sm text-gray-800 dark:text-gray-200 font-normal max-w-[240px] break-words line-clamp-2">
          {content}
        </div>
        <Toast.Toggle className="dark:bg-[#202020] dark:text-gray-600 dark:hover:bg-gray-900 dark:hover:text-gray-100 dark:focus:ring-gray-700 mt-1" />
      </div>
    </Toast>
  );
};

export default ToastMessage;
