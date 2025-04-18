import React from "react";
import Sidebar from "./components/Sidebar";
import MidArea from "./components/MidArea";
import TopBar from "./components/TopBar"; // Import TopBar

export default function App() {
  return (
    <div className="flex flex-col h-screen w-screen bg-gray-50"> {/* Changed to flex-col */}
      <TopBar /> {/* Add TopBar */} 
      <div className="flex flex-1 min-h-0"> {/* Wrapper for Sidebar and MidArea */}
        <Sidebar />
        <MidArea />
      </div>
    </div>
  );
}
