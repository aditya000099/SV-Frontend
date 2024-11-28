import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function MCQGenerator() {
  const [subject, setSubject] = useState("");
  const [subtopic, setSubtopic] = useState("");
  const [mcqs, setMcqs] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [validatedAnswers, setValidatedAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [initial, setInitial] = useState(true);

  const fetchMCQs = async () => {
    try {
      setInitial(false);
      setLoading(true);
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

  return (
    <div className=" text-white min-h-screen p-6 ">
      <Toaster />
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
  );
}
