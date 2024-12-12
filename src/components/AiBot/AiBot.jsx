import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { ChevronDownIcon, ChevronUpIcon, TrashIcon } from '@heroicons/react/24/outline';

export function AiBot() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [roadmaps, setRoadmaps] = useState([]);
  const [formData, setFormData] = useState({
    goal: '',
    timeValue: '',
    timeUnit: 'days'
  });
  const [minimizedRoadmaps, setMinimizedRoadmaps] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  useEffect(() => {
    if (roadmaps.length > 0) {
      const initialMinimizedState = roadmaps.reduce((acc, roadmap) => ({
        ...acc,
        [roadmap._id]: true // true means minimized
      }), {});
      setMinimizedRoadmaps(initialMinimizedState);
    }
  }, [roadmaps]);

  const fetchRoadmaps = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/roadmap/${user._id}`
      );
      console.log('Roadmap data:', response.data);
      setRoadmaps(Array.isArray(response.data) ? response.data : [response.data]);
    } catch (error) {
      console.error('Error fetching roadmaps:', error);
      toast.error('Failed to fetch roadmaps');
      setRoadmaps([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const createRoadmap = async (e) => {
    e.preventDefault();
    if (!formData.goal || !formData.timeValue) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const roadmapData = {
        userId: user._id,
        goal: formData.goal,
        duration: `${formData.timeValue} ${formData.timeUnit}`
      };

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/roadmap/generate`,
        roadmapData
      );
      
      console.log('Created roadmap:', response.data);
      toast.success('Roadmap created successfully!');
      fetchRoadmaps();
      
      setFormData({
        goal: '',
        timeValue: '',
        timeUnit: 'days'
      });
    } catch (error) {
      console.error('Error creating roadmap:', error);
      toast.error('Failed to create roadmap');
    } finally {
      setLoading(false);
    }
  };

  const renderPhase = (phase) => {
    return (
      <div key={phase._id} className="bg-zinc-700 p-4 rounded-xl">
        <h5 className="font-medium text-white mb-2">{phase.phase}</h5>
        <p className="text-zinc-300 mb-3 text-sm">{phase.description}</p>
        <p className="text-purple-400 text-sm mb-3">Duration: {phase.duration}</p>
        <ul className="list-disc list-inside space-y-1 text-zinc-300">
          {phase.tasks?.map((task, idx) => (
            <li key={idx}>{task}</li>
          ))}
        </ul>
      </div>
    );
  };

  const renderResources = (resources) => {
    if (!resources) return null;

    return (
      <div className="space-y-6">
        {resources.videos?.length > 0 && (
          <div>
            <h4 className="font-medium text-white mb-2">Videos</h4>
            <ul className="space-y-2">
              {resources.videos.map((video, idx) => (
                <li key={idx} className="flex items-center space-x-2">
                  <span className="text-purple-400">{video.platform}</span>
                  <span className="text-zinc-400">•</span>
                  <a 
                    href={video.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    {video.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {resources.courses?.length > 0 && (
          <div>
            <h4 className="font-medium text-white mb-2">Courses</h4>
            <ul className="space-y-2">
              {resources.courses.map((course, idx) => (
                <li key={idx} className="flex items-center space-x-2">
                  <span className="text-purple-400">{course.platform}</span>
                  <span className="text-zinc-400">•</span>
                  <a 
                    href={course.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    {course.title}
                  </a>
                  {course.isPaid && (
                    <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                      Paid
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {resources.books?.length > 0 && (
          <div>
            <h4 className="font-medium text-white mb-2">Books</h4>
            <ul className="space-y-2">
              {resources.books.map((book, idx) => (
                <li key={idx}>
                  <a 
                    href={book.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    {book.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const toggleRoadmap = (roadmapId) => {
    setMinimizedRoadmaps(prev => ({
      ...prev,
      [roadmapId]: !prev[roadmapId]
    }));
  };

  const handleDelete = async (roadmapId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/roadmap/${roadmapId}`);
      toast.success('Roadmap deleted successfully');
      setDeleteConfirm(null);
      fetchRoadmaps(); // Refresh the list
    } catch (error) {
      console.error('Error deleting roadmap:', error);
      toast.error('Failed to delete roadmap');
    }
  };

  return (
    <div className="min-h-screen p-8 ">
      <div className="max-w-4xl mx-auto mt-20">
        {/* Form Section */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-white mb-6">Create Your Learning Roadmap</h1>
          
          <form onSubmit={createRoadmap} className="bg-zinc-900 p-6 rounded-xl shadow-md space-y-4">
            {/* Goal Input */}
            <div>
              <label htmlFor="goal" className="block text-sm font-medium text-zinc-300 mb-1">
                What do you want to learn?
              </label>
              <input
                type="text"
                id="goal"
                name="goal"
                value={formData.goal}
                onChange={handleInputChange}
                placeholder="e.g., NextJS"
                className="w-full px-4 py-2 bg-zinc-800 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-zinc-400"
                disabled={loading}
              />
            </div>

            {/* Time Input */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="timeValue" className="block text-sm font-medium text-zinc-300 mb-1">
                  Time Duration
                </label>
                <input
                  type="number"
                  id="timeValue"
                  name="timeValue"
                  value={formData.timeValue}
                  onChange={handleInputChange}
                  min="1"
                  placeholder="Enter number"
                  className="w-full px-4 py-2 bg-zinc-800 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-zinc-400"
                  disabled={loading}
                />
              </div>

              <div className="flex-1">
                <label htmlFor="timeUnit" className="block text-sm font-medium text-zinc-300 mb-1">
                  Unit
                </label>
                <select
                  id="timeUnit"
                  name="timeUnit"
                  value={formData.timeUnit}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-zinc-800 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                  disabled={loading}
                >
                  <option value="days">Days</option>
                  <option value="months">Months</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 
                       disabled:bg-purple-800 disabled:text-zinc-400 transition-colors"
            >
              {loading ? 'Creating...' : 'Generate Roadmap'}
            </button>
          </form>
        </div>

        {/* Roadmaps Display */}
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold text-white mb-6">Your Roadmaps</h2>
          
          {Array.isArray(roadmaps) && roadmaps.map((roadmap, index) => (
            <div 
              key={roadmap._id || index}
              className="bg-zinc-900 p-6 rounded-xl shadow-md space-y-6 relative"
            >
              {/* Header with controls */}
              <div className="flex justify-between items-start">
                <div className="border-b border-zinc-700 pb-4 flex-1">
                  <h3 className="text-2xl font-semibold mb-2 text-white">Goal: {roadmap?.goal}</h3>
                  <p className="text-zinc-400">Duration: {roadmap?.duration}</p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => toggleRoadmap(roadmap._id)}
                    className="p-2 hover:bg-zinc-800 rounded-xl transition-colors"
                    aria-label={minimizedRoadmaps[roadmap._id] ? "Expand" : "Minimize"}
                  >
                    {minimizedRoadmaps[roadmap._id] ? (
                      <ChevronDownIcon className="w-5 h-5 text-zinc-400" />
                    ) : (
                      <ChevronUpIcon className="w-5 h-5 text-zinc-400" />
                    )}
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(roadmap._id)}
                    className="p-2 hover:bg-red-500/20 rounded-xl transition-colors"
                    aria-label="Delete roadmap"
                  >
                    <TrashIcon className="w-5 h-5 text-red-400" />
                  </button>
                </div>
              </div>

              {/* Confirmation Modal */}
              {deleteConfirm === roadmap._id && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-zinc-800 p-6 rounded-xl max-w-md w-full mx-4 shadow-xl">
                    <h4 className="text-xl font-semibold text-white mb-4">Confirm Deletion</h4>
                    <p className="text-zinc-300 mb-6">
                      Are you sure you want to delete this roadmap? This action cannot be undone.
                    </p>
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDelete(roadmap._id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Collapsible Content */}
              {!minimizedRoadmaps[roadmap._id] && (
                <>
                  {/* Learning Path */}
                  {roadmap?.learningPath?.length > 0 && (
                    <div>
                      <h4 className="text-xl font-medium mb-4 text-white">Learning Path</h4>
                      <div className="space-y-4">
                        {roadmap.learningPath.map((phase) => renderPhase(phase))}
                      </div>
                    </div>
                  )}

                  {/* Resources */}
                  {roadmap?.resources && (
                    <div>
                      <h4 className="text-xl font-medium mb-4 text-white">Learning Resources</h4>
                      <div className="bg-zinc-800 p-4 rounded-xl">
                        {renderResources(roadmap.resources)}
                      </div>
                    </div>
                  )}

                  {/* Creation Date */}
                  {roadmap?.createdAt && (
                    <div className="text-sm text-zinc-400 pt-4 border-t border-zinc-700">
                      Created: {new Date(roadmap.createdAt).toLocaleDateString()}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}

          {(!roadmaps || roadmaps.length === 0) && !loading && (
            <div className="text-center py-8 text-zinc-400 bg-zinc-900 rounded-xl shadow-md">
              No roadmaps found. Create one to get started!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AiBot; 