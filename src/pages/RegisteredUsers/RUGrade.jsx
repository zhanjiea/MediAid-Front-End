import { useNavigate } from "react-router-dom";

import userExamData from "../../data/UserExam.json";

import Navbar from "../../components/RegisteredUsers/RUnavbar"
import Buttons from "../../components/Instructors/buttons"

const RUGrade = () => {
    const navigate = useNavigate();

    // Load all attempts for the current user from UserExam.json
    const attempts = userExamData.examAttempts || [];

    // Split graded / ungraded using the `graded` flag in UserExam.json
    const graded = attempts.filter(a => a.graded === true);
    const ungraded = attempts.filter(a => !a.graded);

    return (
        <div className="bg-[#f7f5fa] min-h-screen px-6 sm:px-10 lg:px-[70px] pb-12">
            <Navbar />

            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-[#0A033C]">Exam</h1>

                <div className="mt-8">
                    <h2 className="text-2xl font-semibold text-gray-800">Ungraded Exams</h2>

                    <div className="space-y-3 mt-4">
                        {ungraded.length === 0 && <p className="text-xl text-gray-500">No ungraded exams.</p>}
                        {ungraded.map((attempt, idx) => (
                            <div key={`${attempt.courseId}-${attempt.examId}-${idx}`} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
                                <div className="textarea-lg font-medium">{attempt.title || 'Fail to load'}</div>
                                <div>
                                    <Buttons type="button" buttonName="View" variant="secondary" onClick={() => navigate(`/exam/${attempt.examId}`)} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-8">
                    <h2 className="text-2xl font-semibold text-gray-800">Graded Exams</h2>

                    <div className="space-y-3 mt-4">
                        {graded.length === 0 && <p className="text-xl text-gray-500">No graded exams yet.</p>}
                        {graded.map((attempt, idx) => (
                            <div key={`${attempt.courseId}-${attempt.examId}-${idx}`} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
                                <div className="text-lg font-medium">{attempt.title  || 'Fail to load'}</div>
                                <div>
                                    <Buttons type="button" buttonName={`${attempt.score}%`} variant="primary" onClick={() => navigate(`/exam/${attempt.examId}`)} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RUGrade