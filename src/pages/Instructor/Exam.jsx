import { useNavigate } from "react-router-dom";

import examData from "../../data/exam.json";
import courseData from "../../data/course.json";

import Navbar from "../../components/Instructors/navbar"
import Buttons from "../../components/Instructors/buttons"

const Exam = () => {
    const navigate = useNavigate();

    return(
        <div className="bg-[#f7f5fa] min-h-screen px-6 sm:px-10 lg:px-[70px] pb-12">
            <Navbar />

            <div className="mx-auto">
                <h1 className="text-2xl lg:text-3xl font-bold text-[#0A033C]">Exams Created</h1>

                {/* List of exams (all courses) */}
                <div className="space-y-4 mt-4">
                    {(() => {
                        // flatten all exams and attach courseId and courseTitle so we can show which course each belongs to
                        const allExams = examData.flatMap(entry => {
                            const course = courseData.find(c => Number(c.id) === Number(entry.courseId) || Number(c.courseId) === Number(entry.courseId));
                            const courseTitle = course ? course.title : `Course #${entry.courseId}`;
                            return (entry.exams || []).map(ex => ({ ...ex, courseId: entry.courseId, courseTitle }));
                        });
                        return allExams.map((exam) => (
                            <div key={exam.examId} className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg shadow-sm">
                                <div>
                                    <p className="font-medium">{exam.title}</p>
                                    <p className="text-sm text-gray-500">Course: {exam.courseTitle}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Buttons buttonName="Grade" variant="secondary" onClick={() => navigate(`/exam/${exam.examId}`)} />
                                </div>
                            </div>
                        ));
                    })()}
                </div>

            </div>
        </div>
    )

}

export default Exam