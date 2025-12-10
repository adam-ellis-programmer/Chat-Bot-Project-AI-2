import { FaArrowUp } from 'react-icons/fa';
import { Button } from './ui/button';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

import ReactMarkdown from 'react-markdown';

type FormData = {
  prompt: string;
};

type ChatResponse = {
  message: string;
};

type Message = {
  content: string;
  role: 'user' | 'bot';
};

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const conversationId = useRef(crypto.randomUUID()); // create once and not change so use ref
  const { register, handleSubmit, reset, formState } = useForm<FormData>();
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // prevents new line when reset
      handleSubmit(onSubmit)();
    }
  };

  const onSubmit = async ({ prompt }: FormData) => {
    // as soon as we press enter
    setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
    setIsBotTyping(true);
    reset({ prompt: '' });
    const { data } = await axios.post<ChatResponse>('/api/chat', {
      prompt,
      conversationId: conversationId.current,
    });

    // once we get response from server
    setMessages((prev) => [...prev, { content: data.message, role: 'bot' }]);
    setIsBotTyping(false);
  };

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    return () => {};
  }, [messages]);

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="flex flex-col flex-1 gap-3 mb-10">
        {messages.map((message, i) => (
          <div
            ref={i === messages.length - 1 ? lastMessageRef : null}
            onCopy={(e) => {
              onCopyMessage(e);
            }}
            className={`px-3 py-1 rounded-xl  ${
              message.role === 'user'
                ? 'bg-blue-500 text-white self-end'
                : 'bg-gray-100 text-black'
            }`}
            key={i}
          >
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        ))}

        {isBotTyping && (
          <div className="flex gap-1 px-3 py-3 bg-gray-200 rounded-full self-start">
            <div className="w-2 h-2 bg-gray-800 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-800 rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-2 h-2 bg-gray-800 rounded-full animate-bounce [animation-delay:0.4s]"></div>
          </div>
        )}
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={onKeyDown}
        className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
      >
        <textarea
        autoFocus
          className="w-full  focus:outline-0 resize-none"
          placeholder="Ask anything"
          maxLength={1000}
          {...register('prompt', {
            required: true,
            validate: (data) => data.trim().length > 0,
          })}
        />
        <Button disabled={!formState.isValid} className="rounded-full w-9 h-9">
          <FaArrowUp />
        </Button>
      </form>
    </div>
  );
};

export default ChatBot;
// < HTMLParagraphElement > generic type so we can access the element data in TS
function onCopyMessage(e: React.ClipboardEvent<HTMLParagraphElement>) {
  const selection = window.getSelection()?.toString().trim();
  if (selection) {
    e.preventDefault();
    e.clipboardData.setData('text/plain', selection);
  }
}
