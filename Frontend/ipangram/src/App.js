import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Login from "./components/auth/Login/Login";
import Signup from "./components/auth/Signup/Signup";
import Home from "./components/Home";
import Employees from "./components/Employees";
import Departments from "./components/Departments";
import MyDetails from "./components/MyDetail";

const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" />;
};

const AuthRoute = ({ element }) => {
  return isAuthenticated() ? <Navigate to="/departments" /> : element;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <AuthRoute element={<Login />} />,
  },
  {
    path: "/signup",
    element: <AuthRoute element={<Signup />} />,
  },
  {
    path: "/employees",
    element: <ProtectedRoute element={<Employees />} />,
  },
  {
    path: "/my-details",
    element: <ProtectedRoute element={<MyDetails />} />,
  },
  {
    path: "/departments",
    element: <ProtectedRoute element={<Departments />} />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
