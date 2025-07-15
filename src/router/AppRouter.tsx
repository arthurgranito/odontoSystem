import React, { type JSX } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import PublicRoute from "./PublicRoute";

// Lazy loading for better performance
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Escalas from "../pages/Escalas";
import TiposConsulta from "../pages/TiposConsulta";
import Pacientes from "../pages/Pacientes";
import LiberaçãoAgenda from "../pages/LiberaçãoAgenda";
import Agendamento from "../pages/Agendamento";
import ConsultasAgendadas from "../pages/ConsultasAgendadas";
import Historico from "../pages/Historico";
import Faturamento from "../pages/Faturamento";

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Private Routes - Sem PrivateLayout pois as páginas já têm Sidebar */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/escalas"
          element={
            <PrivateRoute>
              <Escalas />
            </PrivateRoute>
          }
        />

        <Route
          path="/tipos-consulta"
          element={
            <PrivateRoute>
              <TiposConsulta />
            </PrivateRoute>
          }
        />

        <Route
          path="/pacientes"
          element={
            <PrivateRoute>
              <Pacientes />
            </PrivateRoute>
          }
        />

        <Route
          path="/liberacao-agenda"
          element={
            <PrivateRoute>
              <LiberaçãoAgenda />
            </PrivateRoute>
          }
        />

        <Route
          path="/agendamento"
          element={
            <PrivateRoute>
              <Agendamento />
            </PrivateRoute>
          }
        />

        <Route
          path="/consultas"
          element={
            <PrivateRoute>
              <ConsultasAgendadas />
            </PrivateRoute>
          }
        />

        <Route
          path="/historico"
          element={
            <PrivateRoute>
              <Historico />
            </PrivateRoute>
          }
        />

        <Route
          path="/faturamento"
          element={
            <PrivateRoute>
              <Faturamento />
            </PrivateRoute>
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;