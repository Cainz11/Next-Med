import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './core/AuthContext';
import { ToastProvider } from './components/ToastContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { ClinicalNotesPage } from './pages/ClinicalNotesPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { PrescriptionsPage } from './pages/PrescriptionsPage';
import { ExamsPage } from './pages/ExamsPage';
import { HealthMetricsPage } from './pages/HealthMetricsPage';
import { MessagesPage } from './pages/MessagesPage';
import { ConversationDetailPage } from './pages/ConversationDetailPage';
import { ProfessionalsPage } from './pages/ProfessionalsPage';
import { RatingsPage } from './pages/RatingsPage';
import { LgpdPage } from './pages/LgpdPage';
import { DesignSystemPage } from './pages/DesignSystemPage';

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/appointments" element={<ProtectedRoute><AppointmentsPage /></ProtectedRoute>} />
      <Route path="/clinical-notes" element={<ProtectedRoute><ClinicalNotesPage /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
      <Route path="/prescriptions" element={<ProtectedRoute><PrescriptionsPage /></ProtectedRoute>} />
      <Route path="/exams" element={<ProtectedRoute><ExamsPage /></ProtectedRoute>} />
      <Route path="/health-metrics" element={<ProtectedRoute><HealthMetricsPage /></ProtectedRoute>} />
      <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
      <Route path="/messages/:id" element={<ProtectedRoute><ConversationDetailPage /></ProtectedRoute>} />
      <Route path="/professionals" element={<ProtectedRoute><ProfessionalsPage /></ProtectedRoute>} />
      <Route path="/ratings/:id" element={<ProtectedRoute><RatingsPage /></ProtectedRoute>} />
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
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </AuthProvider>
  );
}
