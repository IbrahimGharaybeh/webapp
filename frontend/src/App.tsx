import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Person from './pages/Person';
import Vehicle from './pages/Vehicle';
import Ship from './pages/Ship';
import Photography from './pages/Photography';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage/LandingPage';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/person" element={<Person />} />
        <Route path="/vehicle" element={<Vehicle />} />
        <Route path="/ship" element={<Ship />} />
        <Route path="/photography" element={<Photography />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/landing" element={<LandingPage />} />
      </Routes>
    </>
  );
}

export default App;
