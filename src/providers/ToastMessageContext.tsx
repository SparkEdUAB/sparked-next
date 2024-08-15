import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo } from 'react';
import ToastMessageContainer from '@components/ToastMessage/ToastMessageContainer';

export type ToastMessageData = {
  id: number;
  content: string;
  type: 'success' | 'error' | 'info' | 'warning';
};

type ToastMessageContextProps = {
  warning: (content: string) => string;
  info: (content: string) => string;
  success: (content: string) => string;
  error: (content: string) => string;
};

const ToastMessageContext = createContext<ToastMessageContextProps | undefined>(undefined);

export function useToastMessage() {
  const context = useContext(ToastMessageContext);
  if (!context) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
}

export function ToastMessageProvider({ children }: { children: ReactNode | ReactNode[] }) {
  const [messages, setMessages] = useState<ToastMessageData[]>([]);

  const addMessage = useCallback((content: string, type: ToastMessageData['type'] = 'info') => {
    const id = new Date().getTime();
    setMessages((prevMessages) => [...prevMessages, { id, content, type }]);

    setTimeout(() => {
      setMessages((prevMessages) => prevMessages.filter((message) => message.id !== id));
    }, 5000);

    return content;
  }, []);

  const toastFunctions = useMemo(
    () => ({
      error: (content: string) => addMessage(content, 'error'),
      info: (content: string) => addMessage(content, 'info'),
      success: (content: string) => addMessage(content, 'success'),
      warning: (content: string) => addMessage(content, 'warning'),
    }),
    [addMessage],
  );

  return (
    <ToastMessageContext.Provider value={toastFunctions}>
      {children}
      <ToastMessageContainer messages={messages} />
    </ToastMessageContext.Provider>
  );
}
