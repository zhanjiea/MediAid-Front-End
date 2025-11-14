import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

import courseData from "../../data/course.json";
import examData from "../../data/exam.json";
import answerData from "../../data/answer.json";

import Navbar from "../../components/Instructors/navbar";
import Buttons from "../../components/Instructors/buttons";

const GradeExam = () => {
    const navigate = useNavigate();
    const { examId, studentId } = useParams() || {};
    const [essayMarks, setEssayMarks] = useState({}); // Only track essay marks

    const goBack = () => {
        navigate(-1);
    };

    // Find the exam entry from exam.json
    const flattenedExams = examData.flatMap(entry =>
        (entry.exams || []).map(ex => ({ ...ex, courseId: entry.courseId }))
    );
    const examEntry = flattenedExams.find(e => String(e.examId) === String(examId)) || {};

    // Find course
    const course = courseData.find(
        c => String(c.id) === String(examEntry.courseId) || String(c.courseId) === String(examEntry.courseId)
    ) || {};

    // Find student answer for this exam
    const studentAnswer = answerData.find(
        a => String(a.examId) === String(examId) && String(a.studentId) === String(studentId)
    ) || {};

    // Get the exam questions
    const questions = examEntry.questions || [];

    // Build a map of questionId -> student answer
    const answerMap = {};
    (studentAnswer.answers || []).forEach(a => {
        answerMap[a.questionId] = a.answer;
    });

    // Handle mark input change (essay only)
    const handleMarkChange = (questionId, value) => {
        const numValue = value === '' ? 0 : Math.max(0, Math.min(100, parseInt(value) || 0));
        const newMarks = { ...essayMarks, [questionId]: numValue };
        setEssayMarks(newMarks);
    };

    // Compute totals including MCQ auto-graded marks
    const computeTotals = () => {
        const essayTotal = Object.values(essayMarks).reduce((sum, m) => sum + (Number(m) || 0), 0);
        // MCQ are worth 10 marks each
        const mcqCorrectCount = questions.reduce((count, q) => {
            if (q.type !== 'mc') return count;
            const status = getMCQStatus(q);
            return status.answered && status.correct ? count + 1 : count;
        }, 0);
        const MCQ_WEIGHT = 10;
        const mcqTotal = mcqCorrectCount * MCQ_WEIGHT;

        // maxTotal is sum of per-question weights (mcq=10, essay=100)
        const maxTotal = questions.reduce((sum, q) => sum + (q.type === 'mc' ? MCQ_WEIGHT : 100), 0);

        const rawTotal = essayTotal + mcqTotal;
        const percent = maxTotal > 0 ? Math.round((rawTotal / maxTotal) * 100) : 0;
        return { essayTotal, mcqTotal, rawTotal, maxTotal, percent };
    };

    // Auto-grade MCQs
    const getMCQStatus = (question) => {
        const studentAnswer = answerMap[question.id];
        if (studentAnswer === undefined) return { correct: false, answered: false };
        const isCorrect = studentAnswer === question.correctIndex;
        return { correct: isCorrect, answered: true };
    };

    // Handle Grade (submit) button
    const handleGrade = () => {
        // Build payload with marks and set graded = true
        const totals = computeTotals();
        const payload = {
            studentId: studentAnswer.studentId,
            studentName: studentAnswer.studentName,
            courseId: studentAnswer.courseId,
            examId: studentAnswer.examId,
            graded: true,
            score: totals.percent, // percentage 0-100
            rawTotal: totals.rawTotal,
            maxTotal: totals.maxTotal,
            marks: {
                essay: essayMarks,
                mcq: questions
                    .filter(q => q.type === 'mc')
                    .map(q => ({ questionId: q.id, correct: getMCQStatus(q).correct }))
            },
            timestamp: new Date().toISOString(),
        };

        // eslint-disable-next-line no-console
        console.log("Grade Submission:", payload);

        // Optional: show success message and navigate back
        navigate(-1);
    };

    return (
        <div className="bg-[#f7f5fa] min-h-screen px-6 sm:px-10 lg:px-[70px] pb-12">
            <Navbar />
            <Buttons buttonName="←" variant="back" onClick={goBack} />

            <div>
                <h1 className="text-3xl font-bold text-[#0A033C] mb-2">{examEntry.title || `Exam ${examId || ''}`}</h1>
                <p className="text-xl text-gray-600 mb-1">
                    Course: <span className="font-medium">{course.title || `Course #${examEntry.courseId || ''}`}</span>
                </p>
                <p className="text-xl text-gray-600 mb-6">
                    Student: <span className="font-medium">{studentAnswer.studentName || 'N/A'}</span>
                </p>

                {/* Questions Section */}
                <div className="space-y-6">
                    {questions.length === 0 && <p className="text-gray-500">No questions found for this exam.</p>}

                    {questions.map((question, index) => {
                        const studentAnswerText = answerMap[question.id];
                        const isMC = question.type === 'mc';
                        const mcqStatus = isMC ? getMCQStatus(question) : null;

                        return (
                            <div key={question.id} className="bg-white rounded-xl p-6">
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-800">
                                            {index + 1}. {question.prompt}
                                        </p>
                                    </div>
                                </div>

                                {/* Multiple Choice - Auto-graded */}
                                {isMC && (
                                    <div className="space-y-3">
                                        {question.choices && question.choices.map((choice, choiceIdx) => {
                                            const isStudentSelected = choiceIdx === studentAnswerText;
                                            const isCorrect = choiceIdx === question.correctIndex;
                                            let bgColor = "bg-gray-50";
                                            let textColor = "text-gray-700";
                                            let borderColor = "border-gray-200";

                                            if (isStudentSelected && isCorrect) {
                                                // Correct answer selected - green
                                                bgColor = "bg-green-50";
                                                textColor = "text-green-700";
                                                borderColor = "border-green-300";
                                            } else if (isStudentSelected && !isCorrect) {
                                                // Wrong answer selected -  red
                                                bgColor = "bg-red-50";
                                                textColor = "text-red-700";
                                                borderColor = "border-red-300";
                                            } else if (!isStudentSelected && isCorrect) {
                                                // Correct answer not selected - green
                                                bgColor = "bg-green-50";
                                                textColor = "text-green-700";
                                                borderColor = "border-green-300";
                                            }

                                            return (
                                                <div
                                                    key={choiceIdx}
                                                    className={`flex items-center gap-3 p-3 rounded-md border ${bgColor} ${borderColor}`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name={`grade-${question.id}`}
                                                        checked={isStudentSelected}
                                                        disabled
                                                        className="cursor-default"
                                                    />
                                                    <label className={`flex-1 text-sm font-medium ${textColor} cursor-default`}>
                                                        {String.fromCharCode(97 + choiceIdx)}) {choice}
                                                    </label>
                                                    {isStudentSelected && isCorrect && (
                                                        <span className="text-green-600 font-bold">✓ Correct</span>
                                                    )}
                                                    {isStudentSelected && !isCorrect && (
                                                        <span className="text-red-600 font-bold">✗ Wrong</span>
                                                    )}
                                                    {!isStudentSelected && isCorrect && (
                                                        <span className="text-green-600 font-bold">← Correct Answer</span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                        <p className="text-sm text-gray-600 mt-4 p-3 bg-gray-50 rounded">
                                            {mcqStatus.answered ? (
                                                mcqStatus.correct ? (
                                                    <span className="text-green-600 font-semibold">✓ MCQ Correctly Answered</span>
                                                ) : (
                                                    <span className="text-red-600 font-semibold">✗ MCQ Incorrectly Answered</span>
                                                )
                                            ) : (
                                                <span className="text-gray-600">No answer provided</span>
                                            )}
                                        </p>
                                    </div>
                                )}

                                {/* Essay - Manual grading */}
                                {!isMC && (
                                    <div className="space-y-4">
                                        <div className="pl-4 border-l-2 border-gray-300">
                                            <p className="text-sm font-medium text-gray-600 mb-2">Student Answer:</p>
                                            <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-700 italic border border-gray-200">
                                                {studentAnswerText || '(No answer provided)'}
                                            </div>
                                        </div>

                                        {/* Mark Input for Essays */}
                                        <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-md border border-purple-200">
                                            <label className="text-sm font-medium text-gray-700">Mark:</label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={essayMarks[question.id] ?? ''}
                                                onChange={(e) => handleMarkChange(question.id, e.target.value)}
                                                className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                placeholder="0-100"
                                            />
                                            <span className="text-sm text-gray-500">/ 100</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Total Score and Grade Button */}
                <div className="mt-8 bg-white rounded-xl p-6 border-t-4 border-purple-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Total Essay Marks</p>
                            <p className="text-4xl font-bold text-purple-600">
                                {computeTotals().rawTotal}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">of {computeTotals().maxTotal} total points</p>
                        </div>
                        <div>
                            <Buttons
                                type="button"
                                buttonName={`Grade (${computeTotals().percent}%)`}
                                variant="primary"
                                onClick={handleGrade}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GradeExam;