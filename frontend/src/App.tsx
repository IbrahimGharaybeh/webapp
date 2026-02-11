import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Person from './pages/Person';
import Vehicle from './pages/Vehicle';
import Ship from './pages/Ship';
import Photography from './pages/Photography';
import Dashboard from './pages/Dashboard';
import PermitDetails from './pages/PermitDetails';
import LandingPage from './pages/LandingPage/LandingPage';
import SignInForm from './components/SignInForm';
import SignUpForm from './components/SignUpForm';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import ResetPasswordForm from './components/ResetPasswordForm';
import UserControls from './pages/UserControls';
import MemberControlPage from './pages/MemberControl';
import MakeCompany from './pages/MakeCompany';
import RegisteredPeople from './pages/RegisteredPeople';
import Mission from './pages/Mission';
import { AuthProvider } from './lib/AuthContext';
import { ProtectedRoute } from './lib/ProtectedRoutes';

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<SignInForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/reset-password" element={<ResetPasswordForm />} />
        <Route path="/user-controls" element={<UserControls />} />

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
        <Route path="/permit/:permitId" element={
          <ProtectedRoute><PermitDetails /></ProtectedRoute>
        } />
        <Route path="/member-control" element={
          <ProtectedRoute><MemberControlPage /></ProtectedRoute>
        } />
        <Route path="/make-company" element={
          <ProtectedRoute><MakeCompany /></ProtectedRoute>
        } />
        <Route path="/registered-people" element={
          <ProtectedRoute><RegisteredPeople /></ProtectedRoute>
        } />
        <Route path="/mission" element={
          <ProtectedRoute><Mission /></ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  );
}

export default App;
