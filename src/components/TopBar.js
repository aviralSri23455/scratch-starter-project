import React from 'react';

const TopBar = () => {
  return (
    <div className="w-full h-12 bg-purple-600 text-white flex items-center justify-between px-4 shadow-md">
      <div className="flex items-center space-x-4">
        <span className="font-bold text-lg">SCRATCH</span>
        {/* Placeholder for dropdown menus */}
        <button className="hover:bg-purple-700 px-2 py-1 rounded">Settings</button>
        <button className="hover:bg-purple-700 px-2 py-1 rounded">File</button>
        <button className="hover:bg-purple-700 px-2 py-1 rounded">Edit</button>
        <button className="hover:bg-purple-700 px-2 py-1 rounded">Tutorials</button>
        <button className="hover:bg-purple-700 px-2 py-1 rounded">Debug</button>
      </div>
      <div className="flex items-center space-x-4">
        {/* Placeholder for user actions */}
        <div className="flex items-center space-x-4">
          <input type="text" placeholder="Search..." className="px-2 py-1 rounded bg-white text-black" />
          <button className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded">Join Scratch</button>
          <button className="bg-gray-200 text-gray-700 hover:bg-gray-300 px-3 py-1 rounded">Sign in</button>
        </div>
      </div>
    </div>
  );
};

export default TopBar