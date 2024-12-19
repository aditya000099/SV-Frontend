import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export function Account() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/${user._id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setUserData(response.data);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loginDates = userData?.loginDates || [];

  const generateCalendarData = () => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 364); // Get last 365 days

    const calendar = [];
    for (let i = 0; i < 365; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i);
      
      const wasPresent = loginDates.some(date => {
        const loginDate = new Date(date);
        return loginDate.toDateString() === currentDate.toDateString();
      });

      calendar.push({
        date: currentDate,
        present: wasPresent
      });
    }
    return calendar;
  };

  const calculateCurrentStreak = () => {
    if (!loginDates.length) return 0;
    
    const sortedDates = [...loginDates].sort((a, b) => new Date(b) - new Date(a));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streak = 0;
    let currentDate = today;

    for (const date of sortedDates) {
      const loginDate = new Date(date);
      loginDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((currentDate - loginDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 1) {
        streak++;
        currentDate = loginDate;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const calculateLongestStreak = () => {
    if (!loginDates.length) return 0;
    
    const sortedDates = [...loginDates]
      .sort((a, b) => new Date(a) - new Date(b))
      .map(date => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      });

    let currentStreak = 1;
    let maxStreak = 1;
    
    for (let i = 1; i < sortedDates.length; i++) {
      const diffDays = (sortedDates[i] - sortedDates[i-1]) / (1000 * 60 * 60 * 24);
      
      if (diffDays === 1) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }
    
    return maxStreak;
  };

  const getContributionColor = (present) => {
    return present ? 'bg-[#5D41DE] hover:bg-[#4E35BD]' : 'bg-gray-800 hover:bg-gray-700';
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      {/* User Profile Section */}
      <div className="mb-12 p-6 bg-zinc-800 rounded-2xl backdrop-blur-lg bg-opacity-50">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-[#5D41DE] flex items-center justify-center text-3xl font-bold text-white">
            {userData?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">{userData?.name}</h1>
            <p className="text-gray-400">{userData?.email}</p>
          </div>
        </div>
      </div>

      {/* Activity Calendar Section */}
      <div className="p-6 bg-zinc-800 rounded-2xl backdrop-blur-lg bg-opacity-50">
        <h2 className="text-xl font-bold text-white mb-6">Activity Calendar</h2>
        <div className="overflow-x-auto">
          <div className="inline-grid grid-cols-53 gap-1">
            {generateCalendarData().map((day, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-sm ${getContributionColor(day.present)} transition-colors duration-200`}
                title={`${day.date.toDateString()}: ${day.present ? 'Present' : 'Absent'}`}
              />
            ))}
          </div>
        </div>
        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-gray-800"></div>
            <span className="text-gray-400 text-sm">Absent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[#5D41DE]"></div>
            <span className="text-gray-400 text-sm">Present</span>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="p-6 bg-zinc-800 rounded-2xl backdrop-blur-lg bg-opacity-50">
          <h3 className="text-gray-400 mb-2">Total Days Present</h3>
          <p className="text-3xl font-bold text-white">
            {loginDates.length}
          </p>
        </div>
        <div className="p-6 bg-zinc-800 rounded-2xl backdrop-blur-lg bg-opacity-50">
          <h3 className="text-gray-400 mb-2">Current Streak</h3>
          <p className="text-3xl font-bold text-white">
            {calculateCurrentStreak()} days
          </p>
        </div>
        <div className="p-6 bg-zinc-800 rounded-2xl backdrop-blur-lg bg-opacity-50">
          <h3 className="text-gray-400 mb-2">Longest Streak</h3>
          <p className="text-3xl font-bold text-white">
            {calculateLongestStreak()} days
          </p>
        </div>
      </div>
    </div>
  );
}

export default Account; 