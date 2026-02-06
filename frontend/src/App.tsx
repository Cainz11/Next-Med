import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './core/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { PrescriptionsPage } from './pages/PrescriptionsPage';
import { ExamsPage } from './pages/ExamsPage';
import { HealthMetricsPage } from './pages/HealthMetricsPage';
import { MessagesPage } from './pages/MessagesPage';
import { ConversationDetailPage } from './pages/ConversationDetailPage';
import { ProfessionalsPage } from './pages/ProfessionalsPage';
import { LgpdPage } from './pages/LgpdPage';
import { DesignSystemPage } from './pages/DesignSystemPage';

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/prescriptions" element={<ProtectedRoute><PrescriptionsPage /></ProtectedRoute>} />
      <Route path="/exams" element={<ProtectedRoute><ExamsPage /></ProtectedRoute>} />
      <Route path="/health-metrics" element={<ProtectedRoute><HealthMetricsPage /></ProtectedRoute>} />
      <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
      <Route path="/messages/:id" element={<ProtectedRoute><ConversationDetailPage /></ProtectedRoute>} />
      <Route path="/professionals" element={<ProtectedRoute><ProfessionalsPage /></ProtectedRoute>} />
      <Route path="/lgpd" element={<ProtectedRoute><LgpdPage /></ProtectedRoute>} />
      <Route path="/design-system" element={<ProtectedRoute><DesignSystemPage /></ProtectedRoute>} />
      <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
