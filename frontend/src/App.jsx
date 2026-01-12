import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GunProvider } from './context/GunContext';
import { HomePage } from './pages/HomePage';
import { RoomPage } from './pages/RoomPage';

function App() {
  return (
    <GunProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/r/:roomId" element={<RoomPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </GunProvider>
  );
}

export default App;
