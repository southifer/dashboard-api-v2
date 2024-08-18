import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Content from './components/Content';
import Home from './components/Home';            // Make sure this file exists
import NavigationBar from './components/NavigationBar'; // Make sure this file exists

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-mainBg">
        <NavigationBar />
        <div className="flex flex-1">
          <div className="flex-1 flex flex-col">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Content />} />
              {/* Add more routes here if needed */}
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
