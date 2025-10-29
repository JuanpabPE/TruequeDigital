import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { TaskProvider } from "./context/TasksContext";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import TasksPage from "./pages/TasksPage";
import TaskFormPage from "./pages/TaskFormPage";
import ProfilePage from "./pages/ProfilePage";
import LandingPage from "./pages/LandingPage";
import ProtectedRoute from "./ProtectedRoute";
import Navbar from "./components/Navbar";

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <BrowserRouter>
          <Routes>
            {/* Ruta pública - Landing Page sin navbar del sistema */}
            <Route path="/" element={<LandingPage />} />

            {/* Rutas de autenticación */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Rutas protegidas - Dashboard del sistema */}
            <Route element={<ProtectedRoute />}>
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
    </AuthProvider>
  );
}

export default App;
