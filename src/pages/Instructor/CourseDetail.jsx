import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Navbar from "../../components/Instructors/navbar";
import Buttons from "../../components/Instructors/buttons";
import CourseForm from "../../components/Instructors/courseForm";
import ConfirmDelete from "../../components/Instructors/deleteConfirmation";

import courseData from "../../data/course.json";
import examData from "../../data/exam.json";

const CourseDetail = () => {
    const { courseId } = useParams() || {};
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isExamModalOpen, setIsExamModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedExam, setSelectedExam] = useState(null);

    const navigate = useNavigate();
    const goBack = () => {
        navigate(-1); // Go back one step in history
    };
    const addExam = () => {
        navigate(`/courses/${courseId}/addexam`);
    }

    const handleDeleteClick = (course) => {
        setSelectedCourse(course);
        setIsModalOpen(true);
    };

    const handleExamDeleteClick = (exam) => {
        setSelectedExam(exam);
        setIsExamModalOpen(true);
    };

    const handleConfirmDeleteExam = () => {
        console.log("Deleted exam:", selectedExam.title);
        // TODO: call API to delete exam
        setIsExamModalOpen(false);
        setSelectedExam(null);
    };

    const handleConfirmDelete = () => {
        console.log("Deleted:", selectedCourse.title);
        // TODO: remove from localStorage or API
        setIsModalOpen(false);
        setSelectedCourse(null);
    };

    // find by courseId || fallback to first course
    const course = courseData.find(c => String(c.courseId) === String(courseId)) || {};

    useEffect(() => { window.scrollTo(0,0); }, []);

    return(
        <div className="bg-[#f7f5fa] min-h-screen px-6 sm:px-10 lg:px-[70px] pb-12">
            <Navbar />

            <div className="mx-auto pt-8">
                <Buttons buttonName= "←" variant="back" onClick={goBack}/>

                {/* Course tittle */}
                <div className=" rounded-2xl p-8 shadow-md">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <h1 className="text-2xl lg:text-3xl font-bold text-[#0A033C]">{course.title}</h1>
                        <div className="flex items-center gap-3">
                            <Buttons buttonName="Edit" variant="secondary" onClick={() => setIsFormOpen(true)}/>
                            <Buttons buttonName="Delete" variant="delete" onClick={()=> handleDeleteClick(course)}/>
                        </div>
                    </div>

                    {/* Course details */}
                    <h2 className="text-lg font-bold text-gray-700 mt-8">Course Details</h2>
                    <p className="text-gray-600 mt-4 leading-relaxed">{course.details || "No details available for this course."}</p>

                    {/* Materials */}
                    <h3 className="text-xl font-semibold mt-10 mb-4">Materials</h3>
                    <div className="bg-[#faf7ff] rounded-xl p-6">
                        <div className="relative rounded-lg overflow-hidden">
                            <video
                                src={course.material}
                                alt={course.title}
                                controls
                            />
                        </div>
                    </div>

                        {/* Exams */}
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-10">
                            <h3 className="text-xl font-semibold">Exams</h3>
                            <Buttons buttonName="Add Exam" variant="secondary" onClick={addExam}/>
                        </div>

                        <div className="space-y-4 mt-4">
                            {(() => {
                                const entry = examData.find(e => String(e.courseId) === String(courseId)) || {};
                                const exams = entry.exams || [];
                                return exams.map((exam) => (
                                    <div key={exam.examId} className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg shadow-sm">
                                        <div>
                                            <p className="font-medium">{exam.title}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Buttons buttonName="Edit" variant="secondary" onClick={() => navigate(`/courses/${courseId}/${exam.examId}`)} />
                                            <Buttons buttonName="Delete" variant="delete" onClick={() => handleExamDeleteClick(exam)} />
                                        </div>
                                    </div>
                                ));
                            })()}
                        </div>
                </div>
            </div>
            {isFormOpen && <CourseForm initialValues={course} onClose={() => setIsFormOpen(false)} />}
            
            <ConfirmDelete
                isOpen={isModalOpen}
                onConfirm={handleConfirmDelete}
                onCancel={() => setIsModalOpen(false)}
                itemName={selectedCourse?.title}
            />
            <ConfirmDelete
                isOpen={isExamModalOpen}
                onConfirm={handleConfirmDeleteExam}
                onCancel={() => setIsExamModalOpen(false)}
                itemName={selectedExam?.title}
            />
        </div>
    );
};

export default CourseDetail;