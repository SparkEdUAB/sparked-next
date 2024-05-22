import React from 'react';
import { ToastMessageData } from 'providers/ToastMessageContext';
import ToastMessage from './ToastMessage';

export default function ToastMessageContainer({ messages }: { messages: ToastMessageData[] }) {
  return (
    <div className="fixed top-4 left-0 right-0 z-[1000] h-0 flex flex-col items-center space-y-2">
      {messages.map((message) => (
        <ToastMessage key={message.id} {...message} />
      ))}
    </div>
  );
}
