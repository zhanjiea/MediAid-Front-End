import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";

import Dashboard from "./pages/Instructor/Dashboard.jsx";
import Courses from "./pages/Instructor/Courses.jsx";
import CourseDetail from "./pages/Instructor/CourseDetail.jsx";
import AddExam from "./pages/Instructor/AddExam.jsx";
import Exam from "./pages/Instructor/Exam.jsx";
import Grade from "./pages/Instructor/Grade.jsx";
import GradeExam from "./pages/Instructor/GradeExam.jsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/courses",
    element: <Courses />,
  },
  {
    path: "/courses/:courseId",
    element: <CourseDetail />,
  },
  {
    path: "/courses/:courseId/addexam",
    element: <AddExam />,
  },
  {
    path: "/courses/:courseId/:examId",
    element: <AddExam />,
  },
  {
    path: "/exam",
    element: <Exam />,
  },
  {
    path: "/exam/:examId",
    element: <Grade />
  },
  {
    path: "/exam/:examId/:studentId",
    element: <GradeExam />
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
