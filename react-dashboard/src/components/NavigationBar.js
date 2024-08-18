import React from 'react';
import { Link } from 'react-router-dom';

const NavigationBar = () => {
  return (
    <nav className="bg-[#181A20] text-white p-4 flex justify-between items-center">
      <img
        src="https://cdn.discordapp.com/attachments/1237998564995764265/1274646259537281024/1608465619_icon.png?ex=66c30256&is=66c1b0d6&hm=5a484c2037efe1b3ea388d43b4276d52f437523b452aeec09bd341aaa6c46be9&"
        alt="Logo"
        className="w-12 h-12 rounded-full object-cover" // Adjust size and styling as needed
      />
      <div>
        <Link to="/" className="px-4 py-2 hover:bg-gray-700 rounded">Home</Link>
        <Link to="/dashboard" className="px-4 py-2 hover:bg-gray-700 rounded">Dashboard</Link>
      </div>
    </nav>
  );
};

export default NavigationBar;