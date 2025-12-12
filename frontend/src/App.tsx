import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Person from './pages/Person';
import Vehicle from './pages/Vehicle';
import Ship from './pages/Ship';
import Photography from './pages/Photography';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage/LandingPage';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import { AuthListener } from './lib/AuthListener';
import { AuthProvider } from './lib/AuthContext';
import { ProtectedRoute } from './lib/ProtectedRoutes';

function App() {
  return (
    <AuthProvider>
      <AuthListener />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/person" element={
          <ProtectedRoute><Person /></ProtectedRoute>
        } />
        <Route path="/vehicle" element={
          <ProtectedRoute><Vehicle /></ProtectedRoute>
        } />
        <Route path="/ship" element={
          <ProtectedRoute><Ship /></ProtectedRoute>
        } />
        <Route path="/photography" element={
          <ProtectedRoute><Photography /></ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  );
}

export default App;