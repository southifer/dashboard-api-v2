import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useWindowDimensions from './useWindowDimensions'; // Adjust the path if needed

const Content = () => {
    const [users, setUsers] = useState([]);
    const [previousData, setPreviousData] = useState([]);
    const [updatedCells, setUpdatedCells] = useState(new Set());
    const [selectedRows, setSelectedRows] = useState(new Set());
    const [selectAll, setSelectAll] = useState(false);
    const { width } = useWindowDimensions(); // Get the window width

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://93.113.180.31:5000/api/users');
                const newUsers = response.data;
                const newUpdatedCells = new Set();

                newUsers.forEach((user) => {
                    const prevUser = previousData.find(p => p.index === user.index);
                    if (prevUser) {
                        Object.keys(user).forEach(key => {
                            if (prevUser[key] !== user[key]) {
                                newUpdatedCells.add(`${user.index}-${key}`);
                            }
                        });
                    }
                });

                setUpdatedCells(newUpdatedCells);
                setPreviousData(newUsers);
                setUsers(newUsers);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

        const intervalId = setInterval(() => {
            fetchData();
        }, 2000);

        return () => clearInterval(intervalId);
    }, [previousData]);

    useEffect(() => {
        setSelectAll(users.length > 0 && selectedRows.size === users.length);
    }, [selectedRows, users]);

    const formatNumber = (num) => new Intl.NumberFormat().format(num);

    const handleSelectRow = (index) => {
        setSelectedRows(prevSelectedRows => {
            const newSelectedRows = new Set(prevSelectedRows);
            if (newSelectedRows.has(index)) {
                newSelectedRows.delete(index);
            } else {
                newSelectedRows.add(index);
            }
            return newSelectedRows;
        });
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedRows(new Set()); // Deselect all
        } else {
            setSelectedRows(new Set(users.map(user => user.index))); // Select all
        }
        setSelectAll(!selectAll); // Toggle selectAll state
    };

    const CustomCheckbox = ({ isChecked, onChange }) => {
        return (
            <div
                className={`relative flex items-center justify-center h-4 w-4 border-2 rounded cursor-pointer ${isChecked ? 'bg-white border-white' : 'bg-[#181A20] border-white'}`}
                onClick={onChange}
            >
                {isChecked && (
                    <svg className="absolute w-3 h-3" fill="none" stroke="black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </div>
        );
    };

    const totalUsers = users.length;
    const totalOnline = users.filter(user => user.status === 'Online').length;
    const totalOffline = users.filter(user => user.status !== 'Online').length;
    const totalBanned = users.filter(user => user.status === 'Account Banned').length;
    const totalGems = users.reduce((acc, user) => acc + user.gems, 0);
    const avgGems = totalUsers > 0 ? (totalGems / totalUsers).toFixed(2) : 0;

    const maxTableWidth = width - 100; // Adjust width with a buffer (e.g., 100px)

    return (
        <div className="p-6 bg-mainBg text-white min-h-screen">
            <div className="grid grid-cols-1 gap-6 mb-4">
                <div className="bg-widgetBg p-5 rounded-lg shadow-md">
                    <p className="flex-grow text-xs font-bold text-gray-200 mb-2 uppercase">USER STATISTIC</p>
                    <p>⌐ Online: {formatNumber(totalOnline)}</p>
                    <p>⌐ Offline: {formatNumber(totalOffline)}</p>
                    <p>⌐ Banned: {formatNumber(totalBanned)}</p>
                    <p>⌐ Gems: {formatNumber(totalGems)}</p>
                    <p>⌐ Average Gems: {formatNumber(avgGems)}</p>
                </div>
            </div>
            
            <div className="bg-widgetBg p-4 rounded-lg shadow-md">
                <div className="max-w-full overflow-x-auto custom-scrollbar" style={{ maxWidth: `${maxTableWidth}px` }}>
                    <div className="sticky top-0 bg-bg-widgetBg p-2" style={{ zIndex: 20, backgroundColor: '#181A20' }}>
                        <p style={{ fontSize: '0.7rem' }}>selected bot <u>x{selectedRows.size}</u></p>
                    </div>
                    <div className="max-h-[calc(100vh-210px)] overflow-y-auto custom-scrollbar">
                        <table className="min-w-full divide-y divide-gray-700" style={{ width: '100%' }}>
                            <thead>
                                <tr style={{ position: 'sticky', top: 0, backgroundColor: '#181A20', zIndex: 10 }}>
                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        <CustomCheckbox
                                            isChecked={selectAll}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Username</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Level</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Ping</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rotation</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Proxy</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">World</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Position</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Gems</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Playtime</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Online Time</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Age</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {users.map((user) => (
                                    <tr key={user.index}>
                                        <td className="px-4 py-2 whitespace-nowrap text-center text-sm">
                                            <CustomCheckbox
                                                isChecked={selectedRows.has(user.index)}
                                                onChange={() => handleSelectRow(user.index)}
                                            />
                                        </td>
                                        <td className={`px-4 py-2 whitespace-nowrap text-sm text-gray-300 glow ${updatedCells.has(`${user.index}-username`) ? 'glow-update' : ''}`}>
                                            {user.username}
                                        </td>
                                        <td className={`px-4 py-2 whitespace-nowrap text-sm text-gray-300 glow ${updatedCells.has(`${user.index}-level`) ? 'glow-update' : ''}`}>
                                            Lv. {user.level}
                                        </td>
                                        <td className={`px-4 py-2 whitespace-nowrap text-sm text-gray-300 glow ${updatedCells.has(`${user.index}-ping`) ? 'glow-update' : ''}`}>
                                            {user.ping} ms
                                        </td>
                                        <td className={`px-4 py-2 whitespace-nowrap text-sm ${user.status === 'Online' ? 'text-green-500' : 'text-red-500'}`}>
                                            {user.status}
                                        </td>
                                        <td className={`px-4 py-2 whitespace-nowrap text-sm text-gray-300 glow ${updatedCells.has(`${user.index}-rotation_status`) ? 'glow-update' : ''}`}>
                                            {(user.rotation_status)}
                                        </td>
                                        <td className={`px-4 py-2 whitespace-nowrap text-sm text-gray-300 glow ${updatedCells.has(`${user.index}-proxy`) ? 'glow-update' : ''}`}>
                                            {user.proxy}
                                        </td>
                                        <td className={`px-4 py-2 whitespace-nowrap text-sm text-gray-300 glow ${updatedCells.has(`${user.index}-world`) ? 'glow-update' : ''}`}>
                                            {user.world}
                                        </td>
                                        <td className={`px-4 py-2 whitespace-nowrap text-sm text-gray-300 glow ${updatedCells.has(`${user.index}-position`) ? 'glow-update' : ''}`}>
                                            {user.position}
                                        </td>
                                        <td className={`px-4 py-2 whitespace-nowrap text-sm text-gray-300 glow ${updatedCells.has(`${user.index}-gems`) ? 'glow-update' : ''}`}>
                                        💎 {formatNumber(user.gems)}
                                        </td>
                                        <td className={`px-4 py-2 whitespace-nowrap text-sm text-gray-300 glow ${updatedCells.has(`${user.index}-playtime`) ? 'glow-update' : ''}`}>
                                            {user.playtime} hours
                                        </td>
                                        <td className={`px-4 py-2 whitespace-nowrap text-sm text-gray-300 glow ${updatedCells.has(`${user.index}-online_time`) ? 'glow-update' : ''}`}>
                                            {user.online_time}
                                        </td>
                                        <td className={`px-4 py-2 whitespace-nowrap text-sm text-gray-300 glow ${updatedCells.has(`${user.index}-age`) ? 'glow-update' : ''}`}>
                                            {formatNumber(user.age)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="sticky top-53 bg-bg-widgetBg" style={{ zIndex: 20, backgroundColor: '#181A20' }}>
                        <p className='flex-grow text-xs font-bold text-gray-200 mb-2 text-right' style={{ fontSize: '0.7rem' }}>1 to {totalUsers} of {totalUsers}</p>
                    </div>
                </div>
            </div>
        </div>
    );
    
};

export default Content;
