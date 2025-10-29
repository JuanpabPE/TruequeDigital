import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { TaskProvider } from "./context/TasksContext";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import TasksPage from "./pages/TasksPage";
import TaskFormPage from "./pages/TaskFormPage";
import ProfilePage from "./pages/ProfilePage";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./ProtectedRoute";
import Navbar from "./components/Navbar";
function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <BrowserRouter>
          <main className="container mx-auto px-10">
            <Navbar></Navbar>
            <Routes>
              <Route path="/" element={<HomePage></HomePage>} />
              <Route path="/login" element={<LoginPage></LoginPage>} />
              <Route path="/register" element={<RegisterPage></RegisterPage>} />

              <Route element={<ProtectedRoute></ProtectedRoute>}>
                <Route path="/tasks" element={<TasksPage></TasksPage>} />
                <Route
                  path="/add-task"
                  element={<TaskFormPage></TaskFormPage>}
                />
                <Route
                  path="/tasks/:id"
                  element={<TaskFormPage></TaskFormPage>}
                />
                <Route path="/profile" element={<ProfilePage></ProfilePage>} />
              </Route>
            </Routes>
          </main>
        </BrowserRouter>
      </TaskProvider>
    </AuthProvider>
  );
}

export default App;
