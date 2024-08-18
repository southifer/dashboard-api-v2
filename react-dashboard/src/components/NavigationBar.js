import React from 'react';
import { Link } from 'react-router-dom';

const NavigationBar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Noir'e</h1>
      <div>
        <Link to="/" className="px-4 py-2 hover:bg-gray-700 rounded">Home</Link>
        <Link to="/dashboard" className="px-4 py-2 hover:bg-gray-700 rounded">Dashboard</Link>
      </div>
    </nav>
  );
};

export default NavigationBar;
