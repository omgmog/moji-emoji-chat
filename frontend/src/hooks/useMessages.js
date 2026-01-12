import { useState, useEffect, useRef } from 'react';
import { isEmojiOnly } from '../lib/validation';
import { playNotificationSound, showNotification } from '../lib/notifications';

export function useMessages(room, currentUsername) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const seen = useRef(new Set()).current;
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (!room) return;

    setIsLoading(true);

    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
      isInitialLoad.current = false;
    }, 1000);

    room.map().on((msg, id) => {
      if (!msg || !msg.user || !msg.text) return;
      if (seen.has(id)) return;

      seen.add(id);

      const isNewMessage = !isInitialLoad.current;
      const isOwnMessage = msg.user === currentUsername;

      setMessages(prev =>
        [...prev, { ...msg, id }].sort((a, b) => a.time - b.time)
      );

      if (isNewMessage && !isOwnMessage) {
        playNotificationSound();

        if (document.hidden) {
          showNotification(
            `New message from ${msg.user}`,
            msg.text,
          );
        }
      }

      setIsLoading(false);
      clearTimeout(loadingTimeout);
    });

    return () => {
      clearTimeout(loadingTimeout);
      room.map().off();
    };
  }, [room, seen, currentUsername]);

  const sendMessage = (text, username, color) => {
    if (!room) return false;
    if (!isEmojiOnly(text)) return false;

    room.set({ user: username, text, time: Date.now(), color });
    return true;
  };

  return { messages, sendMessage, isLoading };
}
