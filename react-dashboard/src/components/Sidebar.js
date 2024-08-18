import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    localStorage.setItem('sidebarOpen', JSON.stringify(!isSidebarOpen));
  };

  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem('sidebarOpen'));
    if (savedState !== null) {
      setIsSidebarOpen(savedState);
    } else {
      // Default to minimized
      setIsSidebarOpen(false);
    }
  }, []);

  return (
    <div className={`relative flex ${isSidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 h-screen bg-mainBg text-white`}>
      <button 
        onClick={toggleSidebar} 
        className="absolute top-4 left-4 text-gray-300 hover:text-white lg:hidden z-50"
      >
        <FontAwesomeIcon icon={isSidebarOpen ? faTimes : faBars} className="h-6 w-6" />
      </button>
      {isSidebarOpen && (
        <div className="flex flex-col p-7">
          <h1 className="text-2xl font-bold mb-6">Noir'e</h1>
          <ul>
            <li className="mb-4 flex items-center">
              <FontAwesomeIcon icon={faHome} className="h-6 w-6 text-gray-300 mr-3" />
              <a href="#" className="text-gray-300 hover:text-white">Dashboard</a>
            </li>
            {/* Add more items here */}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
