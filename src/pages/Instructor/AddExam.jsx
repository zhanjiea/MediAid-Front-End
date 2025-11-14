import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import courseData from "../../data/course.json";
import examData from "../../data/exam.json";

import Navbar from "../../components/Instructors/navbar";
import Buttons from "../../components/Instructors/buttons";

const makeEmptyMC = (id) => ({
    id,
    type: "mc",
    prompt: "",
    choices: ["", "", "", ""],
    correctIndex: 0,
});

const makeEmptyEssay = (id) => ({
    id,
    type: "essay",
    prompt: "",
    answerPlaceholder: "",
});

const Exam = () => {
    const { courseId, examId } = useParams() || {};
    const parsedId = Number(courseId);
    const parsedExamId = examId ? Number(examId) : null;

    const navigate = useNavigate();
    const goBack = () => navigate(-1);

    const course = courseData.find((c) => Number(c.courseId) === parsedId) || courseData[0] || {};

    const [title, setTitle] = useState("");
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);

        // if editing existing exam, prefill fields from exam.json
        if (parsedExamId) {
            const entry = examData.find((e) => Number(e.courseId) === parsedId) || {};
            const existingExam = entry.exams ? entry.exams.find((ex) => Number(ex.examId) === parsedExamId) : null;
            if (existingExam) {
                setTitle(existingExam.title || "");
                // normalize questions to our internal shape
                const normalized = (existingExam.questions || []).map((q) => ({
                    id: q.id,
                    type: q.type || "mc",
                    prompt: q.prompt || "",
                    choices: q.choices || ["", "", "", ""],
                    correctIndex: typeof q.correctIndex === "number" ? q.correctIndex : 0,
                    answerPlaceholder: q.answerPlaceholder || "",
                }));
                setQuestions(normalized.length ? normalized : [makeEmptyMC(Date.now())]);
                return; // done
            }
        }

        // start with one question by default
        if (questions.length === 0) {
            setQuestions([makeEmptyMC(Date.now())]);
        }
    }, []);

    const addQuestion = (type = "mc") => {
        const id = Date.now() + Math.floor(Math.random() * 1000);
        const q = type === "mc" ? makeEmptyMC(id) : makeEmptyEssay(id);
        setQuestions((s) => [...s, q]);
    };

    const updateQuestion = (id, patch) => {
        setQuestions((s) => s.map((q) => (q.id === id ? { ...q, ...patch } : q)));
    };

    const removeQuestion = (id) => {
        setQuestions((s) => s.filter((q) => q.id !== id));
    };

    const handleChoiceChange = (qId, idx, value) => {
        setQuestions((s) =>
            s.map((q) =>
                q.id === qId ? { ...q, choices: q.choices.map((c, i) => (i === idx ? value : c)) } : q
            )
        );
    };

    const handleSetCorrect = (qId, idx) => {
        updateQuestion(qId, { correctIndex: idx });
    };

    const handleTypeChange = (qId, newType) => {
        if (newType === "mc") updateQuestion(qId, { type: "mc", choices: ["", "", "", ""], correctIndex: 0 });
        else updateQuestion(qId, { type: "essay", answerPlaceholder: "" });
    };

    const handleCreate = (e) => {
        e.preventDefault();
        // Build payload in the `exam.json` format: [{ courseId, exams: [ { examId, title, questions } ] }]
    const examId = parsedExamId || Date.now();
        const examEntry = {
            examId,
            title,
            questions: questions.map((q) => {
                // normalize question object shape
                if (q.type === "mc") {
                    return {
                        id: q.id,
                        type: q.type,
                        prompt: q.prompt,
                        choices: q.choices,
                        correctIndex: q.correctIndex,
                    };
                }

                // essay
                return {
                    id: q.id,
                    type: q.type,
                    prompt: q.prompt,
                    choices: q.choices || ["", "", "", ""],
                    correctIndex: q.correctIndex || 0,
                    answerPlaceholder: q.answerPlaceholder || "",
                };
            }),
        };

        const payload = {
            courseId: parsedId || course.id || course.courseId,
            exams: [examEntry],
        };

        console.log("Exam payload to send to server:\n", JSON.stringify(payload, null, 2));
        // For now just log and go back — later send this payload to your backend
        navigate(-1);
    };

    return (
        <div className="bg-[#f7f5fa] min-h-screen px-6 sm:px-10 lg:px-[70px] pb-12">
            <Navbar />

            <div className="mx-auto pt-8 max-w-4xl">
                <Buttons buttonName="←" variant="back" onClick={goBack} />
                <h1 className="text-3xl font-bold text-[#0A033C] mb-6">Course: {course.title}</h1>

                <form onSubmit={handleCreate} className="space-y-6">
                    <div className="bg-white rounded-xl p-6">
                        <label className="block text-sm font-semibold text-gray-600 mb-2">Title:</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Test 1 : AED Application"
                            className="w-full p-3 bg-transparent border-b border-gray-300 outline-none"
                            required
                        />
                    </div>

                    <div className="space-y-4">
                        {questions.map((q, idx) => (
                            <div key={q.id} className="bg-white rounded-xl p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <p className="font-medium mb-2">{idx + 1}. {q.prompt || "Question"}</p>
                                        <input
                                            value={q.prompt}
                                            onChange={(e) => updateQuestion(q.id, { prompt: e.target.value })}
                                            placeholder={`Question ${idx + 1}`}
                                            className="w-full p-3 bg-transparent border-b border-gray-200 outline-none mb-4"
                                            required
                                        />

                                        {q.type === "mc" ? (
                                            <div className="space-y-3">
                                                {q.choices.map((choice, i) => (
                                                    <div key={i} className="flex items-center gap-3">
                                                        <input
                                                            type="radio"
                                                            name={`correct-${q.id}`}
                                                            checked={q.correctIndex === i}
                                                            onChange={() => handleSetCorrect(q.id, i)}
                                                            required
                                                        />
                                                        <input
                                                            value={choice}
                                                            onChange={(e) => handleChoiceChange(q.id, i, e.target.value)}
                                                            placeholder={`${String.fromCharCode(97 + i)}) ...`}
                                                            className="w-full p-3 bg-gray-50 rounded-md border border-gray-100 outline-none"
                                                            required
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <textarea
                                                value={q.answerPlaceholder}
                                                onChange={(e) => updateQuestion(q.id, { answerPlaceholder: e.target.value })}
                                                placeholder="Write the expected answer or instructions..."
                                                className="w-full p-3 bg-gray-50 rounded-md min-h-[120px] outline-none"
                                            />
                                        )}
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        <select
                                            value={q.type}
                                            onChange={(e) => handleTypeChange(q.id, e.target.value)}
                                            className="p-2 border rounded-lg bg-white"
                                        >
                                            <option value="mc">Multiple Choice</option>
                                            <option value="essay">Essay</option>
                                        </select>
                                        <Buttons buttonName="Remove" variant="delete" onClick={() => removeQuestion(q.id)} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <button
                        type="button"
                        onClick={() => addQuestion("mc")}
                        className="px-4 py-2 border bg-gray-150 rounded-lg transition duration-200 hover:bg-gray-300"
                        >
                        Add question
                        </button>
                        <Buttons type="submit" buttonName="Create" variant="secondary" />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Exam;