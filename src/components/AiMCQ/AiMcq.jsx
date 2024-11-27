import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function MCQGenerator() {
  const [subject, setSubject] = useState("");
  const [subtopic, setSubtopic] = useState("");
  const [mcqs, setMcqs] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [validatedAnswers, setValidatedAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchMCQs = async () => {
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/api/mcqs", {
        subject,
        subtopic,
      });
    //   console.log(response.data);

      setMcqs(response.data); // Ensure the API returns questions, options, and correctAnswer
      setSelectedAnswers({});
      setValidatedAnswers({});
      setLoading(false);
    } catch (error) {
      console.error("Error fetching MCQs:", error);
      toast.error("Failed to fetch MCQs. Please try again.");
      setLoading(false);
    }
  };

  const handleOptionSelect = (questionIndex, option) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: option,
    });
  };

  const validateAnswer = (questionIndex) => {
    const selectedOption = selectedAnswers[questionIndex];
    const correctAnswer = mcqs[questionIndex].correctAnswer[0]; // Get key (e.g., 'a', 'b', etc.)
    setValidatedAnswers({
      ...validatedAnswers,
      [questionIndex]: selectedOption === correctAnswer,
    });
  };

  return (
    <div className=" text-white min-h-screen p-6 ">
      <Toaster />
      <div className="flex flex-col items-center mt-20">
        <h1 className="text-3xl font-bold mb-6">Generate MCQs</h1>
        <div className="flex gap-4 mb-6">
        <label className="text-sm font-medium text-gray-200">Enter Subject</label>
          <input
            type="text"
            placeholder="Enter Subject"
            className="p-2 bg-zinc-800 border-1 border-purple-600 rounded-xl text-white"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <label className="text-sm font-medium text-gray-200">Enter Subtopic</label>
          <input
            type="text"
            
            placeholder="Enter Subtopic"
            className="p-2 bg-zinc-800 border-1 border-pink-600 rounded-xl text-white"
            value={subtopic}
            onChange={(e) => setSubtopic(e.target.value)}
          />
          <button
            onClick={fetchMCQs}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-normal"
          >
            Generate MCQs
          </button>
        </div>
      </div>

      {loading && <p className="text-center text-lg">Loading MCQs...</p>}

      <div className="mt-6 px-20">
        {mcqs.map((mcq, index) => (
          <div
            key={index}
            className="bg-zinc-800 p-4 rounded mb-4 shadow-md"
          >
            <h2 className="text-xl font-semibold mb-2">
              Q{index + 1}: {mcq.question}
            </h2>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(mcq.options).map(([key, value]) => (
                <label
                  key={key}
                  className={`flex items-center gap-2 p-2 rounded cursor-pointer ${
                    selectedAnswers[index] === key
                      ? "bg-purple-600"
                      : "bg-zinc-700"
                  } hover:bg-zinc-500`}
                >
                  <input
                    type="radio"
                    name={`mcq-${index}`}
                    value={key}
                    checked={selectedAnswers[index] === key}
                    onChange={() => handleOptionSelect(index, key)}
                  />
                  {`${key}. ${value}`}
                </label>
              ))}
            </div>
            <button
              onClick={() => validateAnswer(index)}
              className="mt-3 px-4 py-2 bg-green-600 hover:bg-green-500 rounded font-bold text-white"
            >
              Check Answer
            </button>
            {validatedAnswers[index] !== undefined && (
              <p
                className={`mt-2 font-semibold ${
                  validatedAnswers[index] ? "text-green-400" : "text-red-400"
                }`}
              >
                {validatedAnswers[index]
                  ? "Correct Answer!"
                  : `Wrong! Correct answer is: ${mcq.correctAnswer}`}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
