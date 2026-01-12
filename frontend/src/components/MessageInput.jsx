import { useState, useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { storage } from '../lib/storage';
import { isEmojiOnly } from '../lib/validation';

const emojiExtractRegex = /[\p{Emoji}\u200D\uFE0F\p{Emoji_Modifier}\p{Emoji_Component}]+/gu;

export function MessageInput({ onSend, disabled, onPickerChange }) {
  const [message, setMessage] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    onPickerChange?.(showPicker);
  }, [showPicker, onPickerChange]);

  useEffect(() => {
    if (showPicker) {
      window.history.pushState({ pickerOpen: true }, '');

      const handlePopState = () => {
        setShowPicker(false);
      };

      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [showPicker]);

  const trackEmojiUsage = (text) => {
    const emoji = text.match(emojiExtractRegex) || [];
    emoji.forEach(e => storage.addRecentEmoji(e));
  };

  const insertEmoji = (emoji) => {
    setMessage(prev => prev + emoji);
  };

  const handleSend = () => {
    if (!message.trim()) return;
    if (!isEmojiOnly(message)) return;

    trackEmojiUsage(message);

    const success = onSend(message.trim());
    if (success) {
      setMessage('');
    }
  };

  const hasInvalidChars = message.trim() && !isEmojiOnly(message);

  return (
    <>
      {showPicker && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowPicker(false)}
        />
      )}

      <div className="border-t bg-white p-2 select-none relative z-20">
        <div className="flex flex-col gap-3">
          {showPicker ? (
            <div className="flex flex-col gap-3">
            <div className="px-3 py-2 bg-gray-50 rounded-lg">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">Your message:</div>
                  {message ? (
                    <div className="text-2xl break-all">{message}</div>
                  ) : (
                    <div className="text-gray-400 italic text-sm">Select emoji below!</div>
                  )}
                </div>
                <div className="flex gap-2">
                  {message.trim() && (
                    <button
                      onClick={() => setMessage('')}
                      className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors text-sm"
                      title="Clear"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    onClick={handleSend}
                    disabled={disabled || !message.trim() || hasInvalidChars}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Send"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-hidden emoji-picker-container">
              <EmojiPicker
                onEmojiClick={(emojiData) => {
                  insertEmoji(emojiData.emoji);
                  storage.addRecentEmoji(emojiData.emoji);
                }}
                width="100%"
                previewConfig={{ showPreview: false }}
                searchDisabled={true}
                autoFocusSearch={false}
                skinTonesDisabled={true}
                lazyLoadEmojis={true}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="flex gap-2">
              <button
                onClick={() => setShowPicker(true)}
                disabled={disabled}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors text-left flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {message ? (
                  <span className="text-2xl">{message}</span>
                ) : (
                  <span className="text-gray-400">Tap to select emoji...</span>
                )}
              </button>
              {message.trim() && (
                <button
                  onClick={handleSend}
                  disabled={disabled || hasInvalidChars}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Send"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              )}
            </div>
          </>
        )}
        </div>
      </div>
    </>
  );
}
