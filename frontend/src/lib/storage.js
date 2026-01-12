export const BUBBLE_COLORS = [
  { name: 'Blue', value: 'bg-blue-500', text: 'text-white' },
  { name: 'Purple', value: 'bg-purple-500', text: 'text-white' },
  { name: 'Pink', value: 'bg-pink-500', text: 'text-white' },
  { name: 'Rose', value: 'bg-rose-500', text: 'text-white' },
  { name: 'Orange', value: 'bg-orange-500', text: 'text-white' },
  { name: 'Amber', value: 'bg-amber-500', text: 'text-white' },
  { name: 'Emerald', value: 'bg-emerald-500', text: 'text-white' },
  { name: 'Teal', value: 'bg-teal-500', text: 'text-white' },
  { name: 'Cyan', value: 'bg-cyan-500', text: 'text-white' },
  { name: 'Sky', value: 'bg-sky-500', text: 'text-white' },
  { name: 'Indigo', value: 'bg-indigo-500', text: 'text-white' },
  { name: 'Violet', value: 'bg-violet-500', text: 'text-white' },
  { name: 'Fuchsia', value: 'bg-fuchsia-500', text: 'text-white' },
  { name: 'Red', value: 'bg-red-500', text: 'text-white' },
  { name: 'Lime', value: 'bg-lime-500', text: 'text-white' },
  { name: 'Green', value: 'bg-green-500', text: 'text-white' },
];

export const storage = {
  getUsername: () => localStorage.getItem('username') || '',
  setUsername: (username) => localStorage.setItem('username', username),
  getUserColor: () => localStorage.getItem('userColor') || BUBBLE_COLORS[0].value,
  setUserColor: (color) => localStorage.setItem('userColor', color),
  isColorCommitted: () => localStorage.getItem('colorCommitted') === 'true',
  commitUserColor: () => localStorage.setItem('colorCommitted', 'true'),
  getRecentRooms: () => JSON.parse(localStorage.getItem('recentRooms') || '[]'),
  addRecentRoom: (roomId) => {
    const existing = storage.getRecentRooms();
    const filtered = existing.filter(id => id !== roomId);
    const recent = [roomId, ...filtered].slice(0, 5);
    localStorage.setItem('recentRooms', JSON.stringify(recent));
  },
  getRecentEmoji: () => JSON.parse(localStorage.getItem('recentEmoji') || '[]'),
  addRecentEmoji: (emoji) => {
    const existing = storage.getRecentEmoji();
    const filtered = existing.filter(e => e !== emoji);
    const recent = [emoji, ...filtered].slice(0, 15);
    localStorage.setItem('recentEmoji', JSON.stringify(recent));
  }
};
