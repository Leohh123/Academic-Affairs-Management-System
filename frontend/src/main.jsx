import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Root from "./routes/root";
import ErrorPage from "./error-page";
import Student from "./routes/student";
import Teacher from "./routes/teacher";
import Course from "./routes/course";
import Department from "./routes/department";
import CourseSelection from "./routes/course-selection";
import Login from "./routes/login";
import Register from "./routes/register";
import PermissionDenied from "./routes/permission-denied";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "student",
        element: <Student />,
      },
      {
        path: "teacher",
        element: <Teacher />,
      },
      {
        path: "course",
        element: <Course />,
      },
      {
        path: "department",
        element: <Department />,
      },
      {
        path: "course-selection",
        element: <CourseSelection />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "permission-denied",
        element: <PermissionDenied />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
