import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage, BUBBLE_COLORS } from '../lib/storage';

const generateRoomId = () => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('').substring(0, 12);
};

const extractRoomId = (input) => {
  if (!input) return '';

  try {
    const url = new URL(input.startsWith('http') ? input : `https://${input}`);
    const match = url.pathname.match(/\/r\/([^\/]+)/);
    if (match) return match[1];
  } catch (e) {}

  return input.replace(/^\/r\//, '').trim();
};

export function HomePage() {
  const [username, setUsername] = useState('');
  const [userColor, setUserColor] = useState(BUBBLE_COLORS[0].value);
  const [joinInput, setJoinInput] = useState('');
  const [recentRooms, setRecentRooms] = useState([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setUsername(storage.getUsername());

    if (storage.isColorCommitted()) {
      const savedColor = storage.getUserColor();
      setUserColor(savedColor);
    } else {
      const randomColor = BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)];
      setUserColor(randomColor.value);
    }

    setRecentRooms(storage.getRecentRooms());
  }, []);

  const handleColorSelect = (color) => {
    setUserColor(color);
    storage.setUserColor(color);
    storage.commitUserColor();
    setShowColorPicker(false);
  };

  const enterRoom = (roomId) => {
    if (!username.trim()) {
      alert('Please enter a username');
      return;
    }
    if (!roomId.trim()) {
      alert('Please enter a room ID');
      return;
    }

    storage.setUsername(username);
    storage.setUserColor(userColor);
    storage.commitUserColor();
    storage.addRecentRoom(roomId);
    navigate(`/r/${roomId}`);
  };

  const handleCreateRoom = () => {
    if (!username.trim()) {
      alert('Please enter a username first');
      return;
    }
    const newRoomId = generateRoomId();
    enterRoom(newRoomId);
  };

  const handleJoinRoom = () => {
    const roomId = extractRoomId(joinInput);
    if (!roomId) {
      alert('Please enter a room ID or URL');
      return;
    }
    enterRoom(roomId);
  };

  const handleJoinRecent = (roomId) => {
    if (!username.trim()) {
      alert('Please enter a username first');
      return;
    }
    enterRoom(roomId);
  };

  return (
    <div className="min-h-screen bg-[#ffea00] flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 max-w-lg w-full">
        <div className="mb-4 sm:mb-6">
          <label className="block text-sm font-medium mb-2">Your Name</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="mb-6 sm:mb-8">
          <label className="block text-sm font-medium mb-2">Your Color</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center gap-3 hover:bg-gray-50 transition-colors"
            >
              <div className={`w-6 h-6 rounded ${userColor} ring-1 ring-gray-300`}></div>
              <span className="flex-1 text-left text-sm sm:text-base text-gray-700">
                {BUBBLE_COLORS.find(c => c.value === userColor)?.name || 'Select color'}
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
                        onClick={() => handleColorSelect(color.value)}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${color.value} transition-all ${
                          userColor === color.value
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

        <div className="mb-4 sm:mb-6 space-y-3">
          <button
            onClick={handleCreateRoom}
            className="w-full bg-blue-500 text-white py-3 sm:py-3.5 rounded-xl font-semibold hover:bg-blue-600 transition-all shadow-md hover:shadow-lg text-sm sm:text-base"
          >
            Create New Room
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="text-xs text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={joinInput}
              onChange={(e) => setJoinInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
              placeholder="Paste room link or ID"
              className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
            <button
              onClick={handleJoinRoom}
              className="px-5 sm:px-6 py-2.5 sm:py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg text-sm sm:text-base"
            >
              Join
            </button>
          </div>
        </div>

        {recentRooms.length > 0 && (
          <div className="pt-4 sm:pt-6 border-t">
            <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3 flex items-center gap-2">
              Recent Rooms
            </h3>
            <div className="space-y-1.5 sm:space-y-2">
              {recentRooms.map(room => (
                <button
                  key={room}
                  onClick={() => handleJoinRecent(room)}
                  className="w-full text-left px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between group"
                >
                  <span className="font-mono text-xs sm:text-sm text-gray-700 truncate">#{room}</span>
                  <span className="text-xs text-gray-400 group-hover:text-gray-600 ml-2">Join →</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
