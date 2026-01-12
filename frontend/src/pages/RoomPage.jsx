import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGun } from '../context/GunContext';
import { useMessages } from '../hooks/useMessages';
import { storage, BUBBLE_COLORS } from '../lib/storage';
import { requestNotificationPermission } from '../lib/notifications';
import { RoomHeader } from '../components/RoomHeader';
import { MessageList } from '../components/MessageList';
import { MessageInput } from '../components/MessageInput';

export function RoomPage() {
  const { roomId } = useParams();
  const { gun, status } = useGun();
  const [username, setUsername] = useState('');
  const [userColor, setUserColor] = useState('');
  const [room, setRoom] = useState(null);
  const [showSetup, setShowSetup] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [tempUsername, setTempUsername] = useState('');
  const [tempColor, setTempColor] = useState(BUBBLE_COLORS[0].value);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState([]);

  useEffect(() => {
    const savedUsername = storage.getUsername();

    if (!savedUsername) {
      setShowSetup(true);
      if (storage.isColorCommitted()) {
        setTempColor(storage.getUserColor());
      } else {
        const randomColor = BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)];
        setTempColor(randomColor.value);
      }
    } else {
      setUsername(savedUsername);
      setUserColor(storage.getUserColor());
    }
  }, []);

  useEffect(() => {
    if (gun && roomId) {
      const roomRef = gun.get('room_' + roomId);
      setRoom(roomRef);
      storage.addRecentRoom(roomId);
    }
  }, [gun, roomId]);

  // Request notification permission when entering room
  useEffect(() => {
    if (username) {
      requestNotificationPermission();
    }
  }, [username]);

  const { messages, sendMessage, isLoading } = useMessages(room, username);

  useEffect(() => {
    if (messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];

    if (document.hidden && lastMessage.user !== username) {
      setUnreadMessages(prev => [...prev, lastMessage]);
    }
  }, [messages, username]);

  useEffect(() => {
    if (unreadMessages.length === 0) {
      document.title = `#${roomId} - Emoji Chat`;
    } else if (unreadMessages.length === 1) {
      const msg = unreadMessages[0];
      document.title = `${msg.user}: ${msg.text}`;
    } else {
      const lastMsg = unreadMessages[unreadMessages.length - 1];
      document.title = `${lastMsg.user}: ${unreadMessages.length} new messages`;
    }
  }, [unreadMessages, roomId]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setUnreadMessages([]);
        document.title = `#${roomId} - Emoji Chat`;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [roomId]);

  const handleSend = (text) => {
    return sendMessage(text, username, userColor);
  };

  const handleSetupSubmit = (e) => {
    e.preventDefault();
    if (!tempUsername.trim()) {
      alert('Please enter a username');
      return;
    }
    storage.setUsername(tempUsername);
    storage.setUserColor(tempColor);
    storage.commitUserColor();
    setUsername(tempUsername);
    setUserColor(tempColor);
    setShowSetup(false);
  };

  if (showSetup) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-3 sm:p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 max-w-md w-full">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-1 sm:mb-2">Welcome to #{roomId}!</h1>
          <p className="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6">
            Before joining, please set your name and color
          </p>

          <form onSubmit={handleSetupSubmit}>
            <div className="mb-4 sm:mb-6">
              <label className="block text-sm font-medium mb-2">Your Name</label>
              <input
                type="text"
                value={tempUsername}
                onChange={(e) => setTempUsername(e.target.value)}
                placeholder="Enter your name"
                autoFocus
                className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="mb-4 sm:mb-6">
              <label className="block text-sm font-medium mb-2">Your Color</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-6 h-6 rounded ${tempColor} ring-1 ring-gray-300`}></div>
                  <span className="flex-1 text-left text-sm sm:text-base text-gray-700">
                    {BUBBLE_COLORS.find(c => c.value === tempColor)?.name || 'Select color'}
                  </span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showColorPicker && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowColorPicker(false)}
                    />
                    <div className="absolute z-20 mt-2 w-full bg-white border rounded-lg shadow-lg p-3">
                      <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5 sm:gap-2">
                        {BUBBLE_COLORS.map((color) => (
                          <button
                            key={color.value}
                            type="button"
                            onClick={() => {
                              setTempColor(color.value);
                              storage.setUserColor(color.value);
                              storage.commitUserColor();
                              setShowColorPicker(false);
                            }}
                            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${color.value} transition-all ${
                              tempColor === color.value
                                ? 'ring-2 ring-offset-1 ring-gray-800 scale-110'
                                : 'hover:scale-105 opacity-80 hover:opacity-100'
                            }`}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-500 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-purple-600 transition-colors text-sm sm:text-base"
            >
              Join Room
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (status === 'connecting' || isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Connecting to room...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <RoomHeader roomId={roomId} username={username} />
      <MessageList messages={messages} currentUsername={username} scrollTrigger={pickerOpen} />
      <div className="safe-bottom">
        <MessageInput onSend={handleSend} disabled={!room} onPickerChange={setPickerOpen} />
      </div>
    </div>
  );
}
