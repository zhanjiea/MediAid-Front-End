import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";

// Instructors
import InstructorsDashboard from "./pages/Instructor/Dashboard.jsx";
import InstructorsCourses from "./pages/Instructor/Courses.jsx";
import InstructorsCourseDetail from "./pages/Instructor/CourseDetail.jsx";
import InstructorsAddExam from "./pages/Instructor/AddExam.jsx";
import InstructorsExam from "./pages/Instructor/Exam.jsx";
import InstructorsGrade from "./pages/Instructor/Grade.jsx";
import InstructorsGradeExam from "./pages/Instructor/GradeExam.jsx";

// Registered users
import RUserDashboard from './pages/RegisteredUsers/RUDashboard.jsx'
import RUCourses from "./pages/RegisteredUsers/RUCourses.jsx";
import RUCourseDetail from "./pages/RegisteredUsers/RUCourseDetail.jsx";
import RUTakeExam from "./pages/RegisteredUsers/RUTakeExam.jsx";
import RUGrade from "./pages/RegisteredUsers/RUGrade.jsx";
import RUGradeExam from "./pages/RegisteredUsers/RUGradeExam.jsx";

const userType = "Register user"; 

if (userType === "Instructor") { 
  const router = createBrowserRouter([
    { path: "/", element: <InstructorsDashboard /> },
    { path: "/courses", element: <InstructorsCourses /> },
    { path: "/courses/:courseId", element: <InstructorsCourseDetail /> },
    { path: "/courses/:courseId/addexam", element: <InstructorsAddExam /> },
    { path: "/courses/:courseId/:examId", element: <InstructorsAddExam /> },
    { path: "/exam", element: <InstructorsExam /> },
    { path: "/exam/:examId", element: <InstructorsGrade /> },
    { path: "/exam/:examId/:studentId", element: <InstructorsGradeExam /> },
  ]);

  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}else{
    const router = createBrowserRouter([
    { path: "/", element: <RUserDashboard /> },
    { path: "/courses", element: <RUCourses /> },
    { path: "/courses/:courseId", element: <RUCourseDetail /> },
    { path: "/courses/:courseId/:examId", element: <RUTakeExam /> },
    { path: "/exam", element: <RUGrade /> },
    { path: "/exam/:examId", element: <RUGradeExam /> },
  ]);

  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}