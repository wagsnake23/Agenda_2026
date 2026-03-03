import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/Auth";
import MeuPerfil from "./pages/MeuPerfil";
import AgendamentosPage from "./pages/Agendamentos";
import UsuariosPage from "./pages/Usuarios";
import { Toaster } from 'sonner';

import { CalendarModeProvider } from "@/hooks/use-calendar-mode";
import { CalendarEventsProvider } from "@/context/CalendarEventsContext";
import AdminCalendario from "./pages/AdminCalendario";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster richColors position="bottom-center" />
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <CalendarModeProvider>
            <CalendarEventsProvider>
              <Routes>
                {/* Rota pública */}
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<AuthPage />} />

                {/* Rotas protegidas */}
                <Route
                  path="/meu-perfil"
                  element={
                    <ProtectedRoute>
                      <MeuPerfil />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/agendamentos"
                  element={
                    <ProtectedRoute>
                      <AgendamentosPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/usuarios"
                  element={
                    <ProtectedRoute adminOnly>
                      <UsuariosPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/calendario"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminCalendario />
                    </ProtectedRoute>
                  }
                />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </CalendarEventsProvider>
          </CalendarModeProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;