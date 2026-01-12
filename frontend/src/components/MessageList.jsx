import { useEffect, useRef } from 'react';
import { Message } from './Message';

export function MessageList({ messages, currentUsername, scrollTrigger }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, scrollTrigger]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        <p>No messages yet. Start the conversation!</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      {messages.map(msg => (
        <Message
          key={msg.id}
          username={msg.user}
          text={msg.text}
          timestamp={msg.time}
          color={msg.color}
          isOwn={msg.user === currentUsername}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
