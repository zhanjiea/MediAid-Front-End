import { useParams, useNavigate } from "react-router-dom";

import courseData from "../../data/course.json";
import examData from "../../data/exam.json";
import answerData from "../../data/answer.json";

import Navbar from "../../components/Instructors/navbar"
import Buttons from "../../components/Instructors/buttons"

const Grade = () => {
    const navigate = useNavigate();
        const goBack = () => {
        navigate(-1); // Go back one step in history
    };
    const { examId } = useParams() || {};

    // Find the exam entry (with courseId) from exam.json
    const flattenedExams = examData.flatMap(entry => (entry.exams || []).map(ex => ({ ...ex, courseId: entry.courseId })));
    const examEntry = flattenedExams.find(e => String(e.examId) === String(examId)) || {};

    const course = courseData.find(c => String(c.id) === String(examEntry.courseId) || String(c.courseId) === String(examEntry.courseId)) || {};

    // Answers for this exam from answer.json
    const examAnswersRaw = answerData.filter(a => String(a.examId) === String(examId));

    // Normalize answers: ensure `graded` is a boolean and `score` is number|null
    const examAnswers = examAnswersRaw.map(a => ({
        ...a,
        graded: typeof a.graded === 'boolean' ? a.graded : (typeof a.score === 'number' ? true : false),
        score: typeof a.score === 'number' ? a.score : null,
    }));

    // Warn if any entries lacked explicit flags (helpful during data edits)
    const missingFlagCount = examAnswersRaw.filter(a => typeof a.graded === 'undefined' || typeof a.score === 'undefined').length;
    if (missingFlagCount > 0) {
        // eslint-disable-next-line no-console
        console.warn(`Grade: found ${missingFlagCount} answer entries missing 'graded' or 'score' fields — defaulting to ungraded.`);
    }

    // Split graded / ungraded using the normalized `graded` flag
    const graded = examAnswers.filter(a => a.graded === true);
    const ungraded = examAnswers.filter(a => !a.graded);

    return (
        <div className="bg-[#f7f5fa] min-h-screen px-6 sm:px-10 lg:px-[70px] pb-12">
            <Navbar />
            <Buttons buttonName= "←" variant="back" onClick={goBack}/>

            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-[#0A033C]">{examEntry.title || `Exam ${examId || ''}`}</h1>
                <p className="mt-2 text-xl text-gray-400">Course: <span className="font-medium">{course.title || `Course #${examEntry.courseId || ''}`}</span></p>

                <div className="mt-8">
                    <h2 className="text-2xl font-semibold text-gray-800">Ungraded Students</h2>

                    <div className="space-y-3 mt-4">
                        {ungraded.length === 0 && <p className="text-xl text-gray-500">No ungraded submissions.</p>}
                        {ungraded.map((entry) => (
                            <div key={`${entry.studentId}-${entry.examId}`} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
                                <div className="textarea-lg font-medium">{entry.studentName}</div>
                                <div>
                                    <Buttons type="button" buttonName="Mark" variant="secondary" onClick={() => navigate(`/exam/${entry.examId}/${entry.studentId}`)} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-8">
                    <h2 className="text-2xl font-semibold text-gray-800">Graded</h2>

                    <div className="space-y-3 mt-4">
                        {graded.length === 0 && <p className="text-xl text-gray-500">No graded submissions yet.</p>}
                        {graded.map((entry) => (
                            <div key={`${entry.studentId}-${entry.examId}`} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
                                <div className="text-lg font-medium">{entry.studentName}</div>
                                <div>
                                    <Buttons type="button" buttonName={`${entry.score}%`} variant="primary" onClick={() => navigate(`/exam/${entry.examId}/${entry.studentId}`)} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Grade