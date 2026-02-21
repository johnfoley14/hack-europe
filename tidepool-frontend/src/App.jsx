import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Explore from './pages/Explore';
import CommunityDetail from './pages/CommunityDetail';
import CreateInitiative from './pages/CreateInitiative';
import InitiativeDetail from './pages/InitiativeDetail';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/communities/:id" element={<CommunityDetail />} />
        <Route path="/initiatives/new" element={<CreateInitiative />} />
        <Route path="/initiatives/:id" element={<InitiativeDetail />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
