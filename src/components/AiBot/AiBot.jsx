import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export function AiBot() {
  const { user } = useAuth();
  const [currentGoal, setCurrentGoal] = useState(null);
  const [isQuestioning, setIsQuestioning] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [userResponse, setUserResponse] = useState('');
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roadmap, setRoadmap] = useState(null);

  useEffect(() => {
    checkCurrentGoal();
  }, []);

  const checkCurrentGoal = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/goals/${user._id}`);
      if (response.data) {
        setCurrentGoal(JSON.parse(response.data.goal));
      } else {
        startQuestioning();
      }
      setLoading(false);
    } catch (error) {
      console.error('Error checking goal:', error);
      toast.error('Failed to fetch user goal');
      setLoading(false);
    }
  };

  const startQuestioning = async () => {
    setIsQuestioning(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/bot/question`, {
        previousResponses: [],
        userId: user._id
      });
      console.log('Initial question:', response.data);
      setCurrentQuestion(response.data.question);
    } catch (error) {
      console.error('Error getting question:', error);
      toast.error('Failed to start questionnaire');
    }
  };

  const handleResponse = async (e) => {
    e.preventDefault();
    if (!userResponse.trim()) {
      toast.error('Please provide a response!');
      return;
    }
  
    const currentQA = {
      question: currentQuestion,
      answer: userResponse.trim(),
    };
  
    const newResponses = [...responses, currentQA];
    setResponses(newResponses);
  
    // Show thinking state
    setCurrentQuestion('Thinking...');
    setUserResponse('');
  
    try {
      // Send current conversation to the backend
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/bot/question`, {
        previousResponses: newResponses,
        userId: user._id,
      });
  
      // Update based on AI's response
      if (response.data.complete) {
        toast.success('Generating your personalized roadmap...');
        generateRoadmap(newResponses);
      } else {
        setCurrentQuestion(response.data.question);
      }
    } catch (error) {
      console.error('Error in conversation:', error);
      setCurrentQuestion('Something went wrong. Please try again.');
      toast.error('Failed to process response');
    }
  };
  

  const generateRoadmap = async (allResponses) => {
    try {
      console.log('Generating roadmap with responses:', allResponses);

      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/bot/generate-roadmap`, {
        responses: allResponses,
        userId: user._id
      });

      console.log('Roadmap generated:', response.data);

      const roadmapData = response.data;
      
      const saveResponse = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/goals`, {
        userId: user._id,
        goal: JSON.stringify(roadmapData),
        isCompleted: false,
        progress: 0
      });

      console.log('Goal saved:', saveResponse.data);

      setRoadmap(roadmapData);
      setIsQuestioning(false);
      setCurrentGoal(roadmapData);
      toast.success('Your learning roadmap is ready!');
    } catch (error) {
      console.error('Error generating roadmap:', error);
      toast.error('Failed to generate roadmap');
      setIsQuestioning(false);
    }
  };

  // Add function to update goal progress
  const updateGoalProgress = async (progress) => {
    try {
      await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/goals/${user._id}`, {
        progress,
        updatedAt: new Date()
      });
      toast.success('Progress updated');
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('Failed to update progress');
    }
  };

  // Add function to mark goal as complete
  const markGoalComplete = async () => {
    try {
      await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/goals/${user._id}`, {
        isCompleted: true,
        progress: 100,
        updatedAt: new Date()
      });
      toast.success('Goal marked as complete!');
    } catch (error) {
      console.error('Error completing goal:', error);
      toast.error('Failed to complete goal');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Main Content */}
      {!isQuestioning && !currentGoal && (
        <div className="container mx-auto px-4 py-8 mt-20">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Let's Set Your Learning Goals
            </h1>
            <button
              onClick={startQuestioning}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white transition-all"
            >
              Start Goal Setting
            </button>
          </div>
        </div>
      )}

      {/* Questionnaire Overlay */}
      <AnimatePresence>
        {isQuestioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <div className="max-w-xl w-full mx-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative"
              >
                {/* Bot Image and Message Cloud */}
                <div className="flex items-end mb-8">
                  <img
                    src="/bot.png"
                    alt="AI Bot"
                    className="w-24 h-24 object-contain"
                  />
                  <div className="ml-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl rounded-bl-none max-w-md">
                    <p className="text-white">{currentQuestion}</p>
                  </div>
                </div>

                {/* Response Input */}
                <form onSubmit={handleResponse} className="flex gap-2">
                  <input
                    type="text"
                    value={userResponse}
                    onChange={(e) => setUserResponse(e.target.value)}
                    className="flex-1 p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Type your answer..."
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl text-white"
                  >
                    Send
                  </button>
                </form>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Display Roadmap */}
      {currentGoal && (
        <div className="container mx-auto px-4 py-8 mt-20">
          <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-md rounded-2xl p-8 border-1 border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-4xl font-mwdium text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                Your Learning Roadmap
              </h2>
              <div className="flex items-center gap-4">
                <div className="text-white/70">
                  Progress: {roadmap?.progress || 0}%
                </div>
                <button
                  onClick={() => updateGoalProgress(Math.min((roadmap?.progress || 0) + 10, 100))}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl text-white text-sm"
                >
                  Update Progress
                </button>
                {roadmap?.progress < 100 ? (
                  <button
                    onClick={() => markGoalComplete()}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-xl text-white text-sm"
                  >
                    Mark Complete
                  </button>
                ) : (
                  <span className="px-4 py-2 bg-green-600/20 rounded-xl text-green-400 text-sm">
                    Completed!
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white/90">Main Goal</h3>
                <p className="text-white/70">{currentGoal.mainGoal}</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white/90">Timeline</h3>
                <p className="text-white/70">Expected Achievement: {currentGoal.timeline}</p>
                <p className="text-white/70">Minimum Daily Time: {currentGoal.minimumTime}</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white/90">Milestones</h3>
                <ul className="space-y-2">
                  {currentGoal.milestones.map((milestone, index) => (
                    <li key={index} className="flex items-center text-white/70">
                      <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                        {index + 1}
                      </span>
                      {milestone}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white/90">Resources</h3>
                <ul className="space-y-2">
                  {currentGoal.resources.map((resource, index) => (
                    <li key={index} className="text-purple-400 hover:text-purple-300">
                      <a href={resource.url} target="_blank" rel="noopener noreferrer">
                        {resource.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AiBot; 