import React from 'react';
import Sidebar from './components/Sidebar';
import Content from './components/Content';

function App() {
  return (
    <div className="flex bg-mainBg min-h-screen">
      <div className="flex-1 flex flex-col">
        <Content />
      </div>
    </div>
  );
}

export default App;
