import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { formatDistanceToNow } from 'date-fns';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const StatsPage = () => {
  const [todayStats, setTodayStats] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState([]);
  const [totalTime, setTotalTime] = useState(0);
  const [mostVisitedSites, setMostVisitedSites] = useState([]);

  useEffect(() => {
    const generateMockData = () => {
      // Generate realistic mock data since direct history access is limited
      const websites = [
        { domain: 'google.com', baseVisits: 15 },
        { domain: 'youtube.com', baseVisits: 12 },
        { domain: 'github.com', baseVisits: 8 },
        { domain: 'stackoverflow.com', baseVisits: 6 },
        { domain: 'chat.openai.com', baseVisits: 5 },
        { domain: 'linkedin.com', baseVisits: 4 },
        { domain: 'twitter.com', baseVisits: 7 },
        { domain: 'facebook.com', baseVisits: 3 },
        { domain: 'netflix.com', baseVisits: 2 },
        { domain: 'amazon.com', baseVisits: 4 }
      ];

      const now = Date.now();
      const todayData = websites.map(site => ({
        domain: site.domain,
        visits: site.baseVisits + Math.floor(Math.random() * 5),
        timeSpent: Math.floor(Math.random() * 3600000), // Random time up to 1 hour
        lastVisit: now - Math.floor(Math.random() * 86400000) // Random time within last 24 hours
      }));

      const weeklyData = websites.map(site => ({
        domain: site.domain,
        visits: site.baseVisits * 7 + Math.floor(Math.random() * 20),
        timeSpent: Math.floor(Math.random() * 14400000), // Random time up to 4 hours
        lastVisit: now - Math.floor(Math.random() * 604800000) // Random time within last week
      }));

      return { todayData, weeklyData };
    };

    const { todayData, weeklyData } = generateMockData();
    setTodayStats(todayData);
    setWeeklyStats(weeklyData);
    
    const topSites = [...todayData]
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 5);
    setMostVisitedSites(topSites);

    const total = todayData.reduce((acc, curr) => acc + curr.timeSpent, 0);
    setTotalTime(total);
  }, []);

  const pieChartData = {
    labels: mostVisitedSites.map(site => site.domain),
    datasets: [{
      data: mostVisitedSites.map(site => site.visits),
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF'
      ]
    }]
  };

  const barChartData = {
    labels: weeklyStats.slice(0, 10).map(site => site.domain),
    datasets: [{
      label: 'Weekly Visits',
      data: weeklyStats.slice(0, 10).map(site => site.visits),
      backgroundColor: '#36A2EB'
    }]
  };

  const formatTime = (ms) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 mt-20">Browsing Statistics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-zinc-900 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Today's Most Visited Sites</h2>
          <div className="h-[300px]">
            <Pie data={pieChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-zinc-900 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Weekly Activity</h2>
          <div className="h-[300px]">
            <Bar 
              data={barChartData} 
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 p-6 rounded-xl shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Detailed Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-zinc-900 p-4 rounded-xl">
            <h3 className="text-lg font-medium mb-2">Total Websites Visited</h3>
            <p className="text-2xl font-bold text-blue-600">{todayStats.length}</p>
          </div>
          <div className="bg-zinc-900 p-4 rounded-xl">
            <h3 className="text-lg font-medium mb-2">Total Visits Today</h3>
            <p className="text-2xl font-bold text-green-600">
              {todayStats.reduce((acc, curr) => acc + curr.visits, 0)}
            </p>
          </div>
          <div className="bg-zinc-900 p-4 rounded-xl">
            <h3 className="text-lg font-medium mb-2">Most Recent Activity</h3>
            <p className="text-2xl font-bold text-purple-600">
              {todayStats.length > 0 
                ? formatDistanceToNow(new Date(Math.max(...todayStats.map(s => s.lastVisit))), { addSuffix: true })
                : 'No activity'
              }
            </p>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Top Sites Details</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-zinc-900">
                <th className="px-4 py-2 text-left">Domain</th>
                <th className="px-4 py-2 text-left">Visits</th>
                <th className="px-4 py-2 text-left">Last Visit</th>
              </tr>
            </thead>
            <tbody>
              {mostVisitedSites.map((site, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2">{site.domain}</td>
                  <td className="px-4 py-2">{site.visits}</td>
                  <td className="px-4 py-2">
                    {formatDistanceToNow(new Date(site.lastVisit), { addSuffix: true })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
