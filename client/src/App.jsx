import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { TaskProvider } from "./context/TasksContext";
import { MembershipProvider } from "./context/MembershipContext";
import { ExchangesProvider } from "./context/ExchangesContext";
import { MatchProvider } from "./context/MatchContext";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import TasksPage from "./pages/TasksPage";
import TaskFormPage from "./pages/TaskFormPage";
import ProfilePage from "./pages/ProfilePage";
import LandingPage from "./pages/LandingPage";
import PlansPage from "./pages/PlansPage";
import MembershipDashboard from "./pages/MembershipDashboard";
import CreateExchangePage from "./pages/CreateExchangePage";
import ExchangesListPage from "./pages/ExchangesListPage";
import MyExchangesPage from "./pages/MyExchangesPage";
import ExchangeDetailPage from "./pages/ExchangeDetailPage";
import MatchesPage from "./pages/MatchesPage";
import MatchDetailPage from "./pages/MatchDetailPage";
import ProtectedRoute from "./ProtectedRoute";
import Navbar from "./components/Navbar";

function App() {
  return (
    <AuthProvider>
      <MembershipProvider>
        <ExchangesProvider>
          <MatchProvider>
            <TaskProvider>
              <BrowserRouter>
              <Routes>
                {/* Ruta pública - Landing Page sin navbar del sistema */}
                <Route path="/" element={<LandingPage />} />

                {/* Rutas de autenticación */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Ruta pública - Planes */}
                <Route path="/plans" element={<PlansPage />} />

                {/* Rutas protegidas - Dashboard del sistema */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/membership" element={<MembershipDashboard />} />

                  {/* Rutas de Trueques */}
                  <Route path="/exchanges" element={<ExchangesListPage />} />
                  <Route path="/exchanges/:id" element={<ExchangeDetailPage />} />
                  <Route
                    path="/create-exchange"
                    element={<CreateExchangePage />}
                  />
                  <Route path="/my-exchanges" element={<MyExchangesPage />} />

                  {/* Rutas de Matches */}
                  <Route path="/matches" element={<MatchesPage />} />
                  <Route path="/matches/:id" element={<MatchDetailPage />} />

                  <Route
                    path="/dashboard"
                    element={
                      <main className="container mx-auto px-10">
                        <Navbar />
                        <TasksPage />
                      </main>
                    }
                  />
                  <Route
                    path="/tasks"
                    element={
                      <main className="container mx-auto px-10">
                        <Navbar />
                        <TasksPage />
                      </main>
                    }
                  />
                  <Route
                    path="/add-task"
                    element={
                      <main className="container mx-auto px-10">
                        <Navbar />
                        <TaskFormPage />
                      </main>
                    }
                  />
                  <Route
                    path="/tasks/:id"
                    element={
                      <main className="container mx-auto px-10">
                        <Navbar />
                        <TaskFormPage />
                      </main>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <main className="container mx-auto px-10">
                        <Navbar />
                        <ProfilePage />
                      </main>
                    }
                  />
                </Route>
              </Routes>
            </BrowserRouter>
          </TaskProvider>
        </MatchProvider>
      </ExchangesProvider>
    </MembershipProvider>
  </AuthProvider>
  );
}

export default App;
