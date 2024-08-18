import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Content = () => {
  const [users, setUsers] = useState([]);
  const [previousData, setPreviousData] = useState([]);
  const [updatedRows, setUpdatedRows] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://93.113.180.31:5000/api/users');
        const newUsers = response.data;
        // Check for updates
        const newUpdatedRows = new Set();
        newUsers.forEach((user, index) => {
          const prevUser = previousData.find(p => p.index === user.index);
          if (!prevUser || JSON.stringify(prevUser) !== JSON.stringify(user)) {
            newUpdatedRows.add(user.index);
          }
        });

        setUpdatedRows(newUpdatedRows);
        setPreviousData(newUsers);
        setUsers(newUsers);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // Fetch data initially

    // Set up polling to fetch data every 2 seconds
    const intervalId = setInterval(() => {
      fetchData();
    }, 2000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [previousData]);

  // Helper function to format numbers with commas
  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  // Calculate statistics
  const totalUsers = users.length;
  const totalOnline = users.filter(user => user.status === 'Online').length;
  const totalOffline = users.filter(user => user.status !== 'Online').length;
  const totalGems = users.reduce((acc, user) => acc + user.gems, 0);
  const avgGems = totalUsers > 0 ? (totalGems / totalUsers).toFixed(2) : 0;

  return (
    <div className="p-6 bg-mainBg text-white min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Welcome to the Dashboard</h2>
      
      {/* Widgets */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        <div className="bg-widgetBg p-4 rounded-lg shadow-md aspect-w-1 aspect-h-1">
          <h3 className="text-lg font-semibold mb-2">Statistics</h3>
          <p>Total Online: {formatNumber(totalOnline)}</p>
          <p>Total Offline: {formatNumber(totalOffline)}</p>
          <p>Total Gems: {formatNumber(totalGems)}</p>
          <p>Average Gems: {formatNumber(avgGems)}</p>
        </div>
      </div>
      
      {/* Table */}
      <div className="bg-widgetBg p-4 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Index</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Ping</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rotation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Proxy</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">World</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Gems</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Obtained Gems</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Playtime</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Online Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Age</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {users.map((user) => (
                <tr
                  key={user.index}  // Unique key for each row
                  className={`transition-all ${updatedRows.has(user.index) ? 'bg-gray-600' : ''}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{formatNumber(user.index)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">Lv. {formatNumber(user.level)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatNumber(user.ping)}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${user.status === 'Online' ? 'text-green-400' : 'text-red-400'}`}>{user.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.rotation_status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.proxy}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.world}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.position}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">💎 {formatNumber(user.gems)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatNumber(user.obtained_gems)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{Math.floor(user.playtime / 3600)} hours</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.online_time}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatNumber(user.age)} days</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Content;
