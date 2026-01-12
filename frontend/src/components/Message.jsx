import { BUBBLE_COLORS } from '../lib/storage';

export function Message({ username, text, timestamp, color, isOwn }) {
  const time = new Date(timestamp).toLocaleTimeString();

  const colorObj = BUBBLE_COLORS.find(c => c.value === color);
  const bgColor = color || (isOwn ? 'bg-blue-500' : 'bg-gray-200');
  const textColor = colorObj ? colorObj.text : (isOwn || color ? 'text-white' : 'text-gray-900');

  return (
    <div className={`mb-3 flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs px-4 py-2 rounded-2xl ${bgColor} ${textColor}`}>
        {!isOwn && <div className="font-bold text-sm opacity-90">{username}</div>}
        <div className="text-6xl">{text}</div>
        <div className="text-xs opacity-70 mt-1">{time}</div>
      </div>
    </div>
  );
}
