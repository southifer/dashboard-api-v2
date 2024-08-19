import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
    const [users, setUsers] = useState([]);
    const [previousData, setPreviousData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://93.113.180.31:5000/api/users');
                const newUsers = response.data;

                const updatedCells = new Set();
                newUsers.forEach((user) => {
                    const prevUser = previousData.find(p => p.index === user.index);
                    if (prevUser) {
                        Object.keys(user).forEach(key => {
                            if (prevUser[key] !== user[key]) {
                                updatedCells.add(`${user.index}-${key}`);
                            }
                        });
                    }
                });

                // Update the users and previous data state
                setUsers(newUsers);
                setPreviousData(newUsers);

                // newUsers.forEach((user) => {

                // });              
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

    return (
        <div className="p-6 bg-mainBg text-white min-h-screen overflow-x-hidden">
            <div className="grid grid-cols-1 gap-6 mb-4">
                <div className="bg-widgetBg p-5 rounded-lg shadow-md">
                    <p className="flex-grow text-xs font-bold text-gray-200 mb-2 uppercase">User Information</p>
                    <p className='text-white'>⌐ bot: x<strong>{users.length}</strong></p>
                </div>
            </div>
        </div>
    );
};

export default Home;
