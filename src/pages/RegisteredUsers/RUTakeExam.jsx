import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import courseData from "../../data/course.json";
import examData from "../../data/exam.json";

import Navbar from "../../components/RegisteredUsers/RUnavbar";
import Buttons from "../../components/Instructors/buttons";

const RUTakeExam = () => {
    const { courseId, examId } = useParams() || {};
    const parsedId = Number(courseId);
    const parsedExamId = examId ? Number(examId) : null;

    const navigate = useNavigate();
    const goBack = () => navigate(-1);

    const course = courseData.find((c) => Number(c.courseId) === parsedId) || courseData[0] || {};

    const [title, setTitle] = useState("");
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({}); // questionId -> answer (number for mc, string for essay)

    useEffect(() => {
        window.scrollTo(0, 0);

        if (parsedExamId) {
            const entry = examData.find((e) => Number(e.courseId) === parsedId) || {};
            const existingExam = entry.exams ? entry.exams.find((ex) => Number(ex.examId) === parsedExamId) : null;
            if (existingExam) {
                setTitle(existingExam.title || "");
                const normalized = (existingExam.questions || []).map((q) => ({
                    id: q.id,
                    type: q.type || "mc",
                    prompt: q.prompt || "",
                    choices: q.choices || ["", "", "", ""],
                    correctIndex: typeof q.correctIndex === "number" ? q.correctIndex : null,
                }));
                setQuestions(normalized);
            }
        }
    }, [parsedExamId, parsedId]);

    const handleMCQChange = (questionId, choiceIdx) => {
        setAnswers((s) => ({ ...s, [questionId]: choiceIdx }));
    };

    const handleEssayChange = (questionId, text) => {
        setAnswers((s) => ({ ...s, [questionId]: text }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Build payload similar to answer.json entries
        const payload = {
            courseId: parsedId,
            examId: parsedExamId,
            graded: false,
            score: null,
            answers: questions.map((q) => ({ questionId: q.id, answer: answers[q.id] ?? null })),
        };

        // eslint-disable-next-line no-console
        console.log("Student submission payload:", JSON.stringify(payload, null, 2));
        navigate(-1);
    };

    return (
        <div className="bg-[#f7f5fa] min-h-screen px-6 sm:px-10 lg:px-[70px] pb-12">
            <Navbar />

            <div>
                <Buttons buttonName="←" variant="back" onClick={goBack} />
                <h1 className="text-3xl font-bold text-[#0A033C] mb-2">{title || `Exam ${parsedExamId || ''}`}</h1>
                <p className="text-gray-600 mb-4 text-xl">Course: <span className="font-medium">{course.title}</span></p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-6">
                        {questions.length === 0 && <p className="text-gray-500">No questions found for this exam.</p>}

                        {questions.map((q, idx) => (
                            <div key={q.id} className="bg-white text-xl rounded-xl p-6">
                                <p className="font-medium mb-3">{idx + 1}. {q.prompt}</p>

                                {q.type === 'mc' ? (
                                    <div className="space-y-2">
                                        {q.choices.map((choice, i) => (
                                            <label key={i} className="flex items-center gap-3 p-2 rounded border border-gray-100 hover:bg-gray-50">
                                                <input
                                                    type="radio"
                                                    name={`q-${q.id}`}
                                                    checked={answers[q.id] === i}
                                                    onChange={() => handleMCQChange(q.id, i)}
                                                    required
                                                />
                                                <span className="text-lg"> {choice}</span>
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    <textarea
                                        value={answers[q.id] ?? ''}
                                        onChange={(e) => handleEssayChange(q.id, e.target.value)}
                                        placeholder={q.answerPlaceholder || 'Write your answer here...'}
                                        className="w-full p-3 bg-gray-50 rounded-md min-h-[120px] outline-none text-lg"
                                        required
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center">
                        <Buttons type="submit" buttonName="Submit Answers" variant="secondary" />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RUTakeExam;