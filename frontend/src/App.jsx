import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import { HomePage } from './pages/HomePage';
import RegisterStudent from './pages/RegisterStudent';
import RegisterTeacher from './pages/RegisterTeacher';
import Login from './pages/Login';
import StudentProfile from './pages/StudentProfile';
import TeacherProfile from './pages/TeacherProfile';
import ProtectedRoute from './components/ProtectedRoute';

const ProfilePage = () => {
    const { user } = useAuth();
    if (!user) return <Login />;
    return user.role === 'teacher' ? <TeacherProfile /> : <StudentProfile />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register-student" element={<RegisterStudent />} />
          <Route path="/register-teacher" element={<RegisterTeacher />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;