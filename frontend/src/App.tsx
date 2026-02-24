import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './core/AuthContext';
import { ToastProvider } from './components/ToastContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppLayout } from './components/AppLayout';
import { LandingPage } from './pages/LandingPage';
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
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
      <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="clinical-notes" element={<ClinicalNotesPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="prescriptions" element={<PrescriptionsPage />} />
        <Route path="exams" element={<ExamsPage />} />
        <Route path="health-metrics" element={<HealthMetricsPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="messages/:id" element={<ConversationDetailPage />} />
        <Route path="professionals" element={<ProfessionalsPage />} />
        <Route path="ratings/:id" element={<RatingsPage />} />
        <Route path="lgpd" element={<LgpdPage />} />
        <Route path="design-system" element={<DesignSystemPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
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
