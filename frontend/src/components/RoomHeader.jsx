import { useNavigate } from 'react-router-dom';

export function RoomHeader({ roomId, username }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white border-b px-4 py-3 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-bold">#{roomId}</h1>
        <p className="text-sm text-gray-600">Logged in as {username}</p>
      </div>
      <button
        onClick={() => navigate('/')}
        className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
      >
        Leave Room
      </button>
    </div>
  );
}
