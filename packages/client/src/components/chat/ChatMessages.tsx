import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

export type Message = {
  content: string;
  role: 'user' | 'bot';
};

type props = {
  messages: Message[];
};

const ChatMessages = ({ messages }: props) => {
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  function onCopyMessage(e: React.ClipboardEvent<HTMLParagraphElement>) {
    const selection = window.getSelection()?.toString().trim();
    if (selection) {
      e.preventDefault();
      e.clipboardData.setData('text/plain', selection);
    }
  }

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    return () => {};
  }, [messages]);

  return (
    <div className="flex flex-col gap-2">
      {messages.map((message, i) => (
        <div
          ref={i === messages.length - 1 ? lastMessageRef : null}
          onCopy={(e) => {
            onCopyMessage(e);
          }}
          className={`px-3 py-1 rounded-xl max-w-md  ${
            message.role === 'user'
              ? 'bg-blue-500 text-white self-end'
              : 'bg-gray-100 text-black '
          }`}
          key={i}
        >
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
