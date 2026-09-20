import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Subjects from './pages/Subjects';
import Topics from './pages/Topics';
import QuizStart from './pages/QuizStart';
import Quiz from './pages/Quiz';
import QuizResult from './pages/QuizResult';
import Performance from './pages/Performance';
import Profile from './pages/Profile';

export default function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Authenticated Dashboard Pages */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/topics/:subjectId" element={<Topics />} />
        <Route path="/quiz/start/:topicId" element={<QuizStart />} />
        <Route path="/quiz/:attemptId" element={<Quiz />} />
        <Route path="/quiz/result/:attemptId" element={<QuizResult />} />
        <Route path="/performance" element={<Performance />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Fallback Catch-All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
