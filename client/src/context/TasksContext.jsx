import { createContext, useState, useContext, useEffect } from "react";
import {
  createTaskRequest,
  getTasksRequest,
  deleteTaskRequest,
  getTaskRequest,
  updateTaskRequest,
} from "../api/tasks";
import { useAuth } from "./AuthContext";

const TaskContext = createContext();

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};

export function TaskProvider({ children }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);

  // Limpiar el estado cuando cambia el usuario
  useEffect(() => {
    console.log("🔄 Usuario cambió, limpiando tasks...");
    setTasks([]);
  }, [user?.id]);

  const getTasks = async () => {
    try {
      const res = await getTasksRequest();
      setTasks(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const createTask = async (task) => {
    try {
      const res = await createTaskRequest(task);
      setTasks([...tasks, res.data]);
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const res = await deleteTaskRequest(id);
      if (res.status === 204) setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const getTask = async (id) => {
    try {
      const res = await getTaskRequest(id);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  const updateTask = async (id, task) => {
    try {
      const res = await updateTaskRequest(id, task);
      setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <TaskContext.Provider
      value={{ tasks, createTask, getTasks, deleteTask, getTask, updateTask }}
    >
      {children}
    </TaskContext.Provider>
  );
}
