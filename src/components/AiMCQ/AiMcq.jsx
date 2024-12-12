import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { ArrowUpRight, CheckCircle2, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

export default function MCQGenerator() {
  const { user } = useAuth();
  const [subject, setSubject] = useState("");
  const [subtopic, setSubtopic] = useState("");
  const [mcqs, setMcqs] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [validatedAnswers, setValidatedAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [initial, setInitial] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [questionHistory, setQuestionHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFromHistory, setIsFromHistory] = useState(false);
  const [canSave, setCanSave] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    fetchQuestionHistory();
  }, []);

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = scrollbarStyles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const fetchQuestionHistory = async () => {{
    try {
      // setInitial(false);
      // setLoading(true);
  
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/mcqs/history`, {
        userId: user._id,  // Ensure you have the user object with _id
      });
  
      console.log(response.data);
      setQuestionHistory(response.data);
      // setMcqs(response.data); // Set the fetched MCQs
      // setSelectedAnswers({});
      // setValidatedAnswers({});
      // setLoading(false);
    } catch (error) {
      console.error("Error fetching MCQs History:", error);
      toast.error("Failed to fetch MCQs History. Please try again.");
      setLoading(false);
      setInitial(true);
    }
  }};

  const calculateProgress = () => {
    const attemptedCount = Object.keys(selectedAnswers).length;
    const totalQuestions = mcqs.length;
    setProgress((attemptedCount / totalQuestions) * 100);

    // Enable save button when all questions are attempted
    if (attemptedCount === totalQuestions && totalQuestions > 0) {
      calculateScore();
      setCanSave(true);
    }
  };

  const calculateScore = () => {
    let correctCount = 0;
    Object.entries(selectedAnswers).forEach(([index, answer]) => {
      if (answer === mcqs[index].correctAnswer[0]) {
        correctCount++;
      }
    });
    const calculatedScore = (correctCount / mcqs.length) * 100;
    setScore(calculatedScore);
    setShowScore(true);
  };

  const handleSave = async () => {
    if (!canSave || isSaved || isFromHistory) return;
    
    try {
      const token = localStorage.getItem("token");
      const requestData = {
        userId: user._id,
        subject,
        subtopic,
        questions: JSON.stringify(mcqs),
        score: score, // Use the score directly
      };

      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/mcqs/save`,
        requestData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setIsSaved(true);
      toast.success("Questions saved successfully!");
      fetchQuestionHistory();
    } catch (error) {
      console.error("Error saving questions:", error.response?.data || error.message);
      toast.error("Failed to save questions");
    }
  };

  useEffect(() => {
    calculateProgress();
  }, [selectedAnswers]);

  const fetchMCQs = async () => {
    try {
      setInitial(false);
      setLoading(true);
      setIsFromHistory(false); // Reset when fetching new MCQs
      setCanSave(false); // Reset save button state
      setIsSaved(false); // Reset saved state
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/mcqs`, {
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
      setInitial(true);
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

  const handleHistoryClick = (id) => {
    try {
      const historyItem = questionHistory.find((item) => item._id === id);
      if (!historyItem) {
        toast.error("Question set not found");
        return;
      }

      // Parse the stringified questions
      const parsedQuestions = JSON.parse(historyItem.questions);
      
      // Reset all states
      setInitial(false);
      setSelectedAnswers({});
      setValidatedAnswers({});
      setProgress(0);
      setShowScore(false);
      setScore(0);
      
      // Set the subject and subtopic
      setSubject(historyItem.subject);
      setSubtopic(historyItem.subtopic);
      
      // Set the questions
      setMcqs(parsedQuestions);
      
      // Close sidebar on mobile
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      toast.success("Loaded previous question set");
      setIsFromHistory(true); // Set when loading from history
    } catch (error) {
      console.error("Error loading historical questions:", error);
      toast.error("Failed to load questions");
    }
  };

  const handleDeleteHistory = async (id, e) => {
    e.stopPropagation(); // Prevent triggering handleHistoryClick
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/mcqs/${id}`, {
        data: { userId: user._id }
      });
      toast.success("History item deleted");
      fetchQuestionHistory(); // Refresh history
    } catch (error) {
      console.error("Error deleting history:", error);
      toast.error("Failed to delete history item");
    }
  };

  return (
    <div className="flex min-h-screen text-white">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed left-0 top-20 h-screen w-72 bg-black/20 backdrop-blur-xl border-r border-white/10 p-6 overflow-y-auto z-50 custom-scrollbar"
          >
            <h2 className="text-xl font-semibold ml-12 mb-6 text-white/90">Question History</h2>
            {questionHistory.length > 0 ? (
              questionHistory.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleHistoryClick(item._id)}
                  className="mb-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all relative group"
                >
                  <button
                    onClick={(e) => handleDeleteHistory(item._id, e)}
                    className="absolute bg-red-500 right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full bg-red-500/20 hover:bg-red-500/40"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                  <h3 className="font-medium text-white/80">{item.subject}</h3>
                  <p className="text-sm text-white/60">{item.subtopic}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm text-white/40">Score:</span>
                    <span className={`text-sm ${item.score >= 70 ? 'text-green-400' : 'text-red-400'}`}>
                      {item.score}%
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-white/50 mt-10">
                No history found
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 p-6 ">
        {/* Toggle Sidebar Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed left-6 top-[6.2rem] z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Progress Bar */}
        {mcqs.length > 0 && (
          <div className="fixed top-0 left-0 w-full h-2 bg-gray-700 z-50">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            />
          </div>
        )}

        {/* Score Modal */}
        <AnimatePresence>
          {showScore && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 flex items-center justify-center z-50"
            >
              <div className="bg-black/20 backdrop-blur-xl p-8 rounded-2xl border-1 border-white/10 text-center">
                <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
                <p className="text-4xl font-bold mb-6">
                  Score: {Math.round(score)}%
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => {
                      setShowScore(false);
                      setMcqs([]);
                      setSelectedAnswers({});
                      setValidatedAnswers({});
                    }}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors"
                  >
                    New Quiz
                  </button>
                  <button
                    onClick={() => setShowScore(false)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-xl transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col items-center mt-20">
          <h1 className="font-normal tracking-tighter text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center text-transparent bg-clip-text bg-gradient-to-tr from-zinc-400/50 to-white/60 via-white mb-16">Think. Test. Evolve.</h1>
          <div className="flex gap-4 mb-6">
            <label className="text-xl font-regular text-gray-200">
              Subject :
            </label>
            <input
              type="text"
              placeholder="eg. Web Dev"
              className="p-2 bg-zinc-800 rounded-2xl text-white"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <label className="text-xl font-regular text-gray-200">
              Subtopic :
            </label>
            <input
              type="text"
              placeholder="eg. ExpressJS"
              className="p-2 bg-zinc-800 rounded-2xl text-white"
              value={subtopic}
              onChange={(e) => setSubtopic(e.target.value)}
            />
            <HoverBorderGradient
              containerClassName="rounded-full border-1"
              onClick={fetchMCQs}
              as="button"
              className="dark:bg-black  dark:text-white flex items-center space-x-2"
            >
              <span>Generate MCQs</span>
            </HoverBorderGradient>
            {/* <button
              onClick={fetchMCQs}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-normal"
            >
              Generate MCQs
            </button> */}
          </div>
        </div>

        {loading && (
          <div class="flex flex-row items-center justify-center gap-2">
            <div class="w-4 h-4 rounded-full bg-purple-500 animate-bounce"></div>
            <div class="w-4 h-4 rounded-full bg-purple-500 animate-bounce [animation-delay:-.3s]"></div>
            <div class="w-4 h-4 rounded-full bg-purple-500 animate-bounce [animation-delay:-.5s]"></div>
          </div>
        )}
        {initial && (
          <section
            className="relative bg-page-gradient [box-shadow:0_-20px_80px_-20px_#8686f01f_inset] min-h-[400px] border-[1px] border-white/20 flex flex-col gap-8 justify-center items-center mt-8 mb-28 w-full md:w-3/4 rounded-3xl py-1 px-3 md:px-8 mx-auto"
          >
            <div className="absolute -z-1 inset-0 rounded-3xl opacity-5   h-[600px] w-full bg-transparent  bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
            <div className="absolute top-0 z-0 w-screen  right-0 mx-auto h-[650px] overflow-hidden bg-inherit  bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(164,107,250,0.3),rgba(255,255,255,0))]"></div>

            <div className="absolute left-0 w-full h-full z-[-1]">
              {/* a purple gradient line that's slightly tilted with blur (a lotof blur)*/}
              <div className="overflow-hidden">
                <div
                  className="absolute left-[20%] top-[-165%] h-32 w-full overflow-hidden bg-[#7611fa] bg-opacity-70 blur-[337.4px]"
                  style={{ transform: "rotate(-30deg)" }}
                />
              </div>
            </div>
            <h1 className="z-20 mx-auto mt-0 max-w-xl font-normal tracking-tighter text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center text-transparent bg-clip-text bg-gradient-to-tr from-zinc-400/50 to-white/60 via-white">
              AI questions for any topic. In Seconds
            </h1>
            <p className="z-20 text-center text-md md:text-lg">
              Start by giving topic and subtopic
            </p>
            <div className="w-fit  mx-auto">
              {/* <Link
                href="/signin"
                className="flex mx-auto w-fit gap-x-2 justify-center items-center py-2 px-4 ml-3  rounded-3xl border-1 duration-200 group bg-page-gradient border-white/30 text-md font-geistSans hover:border-zinc-600 hover:bg-transparent/10 hover:text-zinc-100 text-white z-[1] relative"
              >
                Get Started
                <div className="flex overflow-hidden relative justify-center items-center ml-1 w-5 h-5">
                  <ArrowUpRight className="absolute transition-all duration-500 group-hover:translate-x-4 group-hover:-translate-y-5" />
                  <ArrowUpRight className="absolute transition-all duration-500 -translate-x-4 -translate-y-5 group-hover:translate-x-0 group-hover:translate-y-0" />
                </div>
              </Link> */}
            </div>
          </section>
        )}

        <div className="mt-6 px-20">
          {mcqs.length > 0 && canSave && !isFromHistory && !isSaved && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleSave}
              className="fixed bottom-8 right-8 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-normal shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all z-50"
            >
              Save Questions
            </motion.button>
          )}
          
          {mcqs.map((mcq, index) => (
            <div
              key={index}
              className="bg-zinc-900 p-4 rounded-3xl mb-4 shadow-md"
            >
              <h2 className="text-xl font-light mb-6">
                Q{index + 1}: {mcq.question}
              </h2>
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(mcq.options).map(([key, value]) => (
                  <label
                    key={key}
                    className={`flex items-center gap-2 p-2 rounded-2xl cursor-pointer ${
                      selectedAnswers[index] === key
                        ? "bg-purple-600"
                        : "bg-zinc-800"
                    } hover:bg-zinc-600`}
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
                className="mt-3 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-2xl font-light text-white"
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
    </div>
  );
}
