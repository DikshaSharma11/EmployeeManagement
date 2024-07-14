import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/auth/Login/Login";
import Signup from "./components/auth/Signup/Signup";
import Home from "./components/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
