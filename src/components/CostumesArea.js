import React, { useState } from 'react'; // Import useState
import Icon from './Icon'; // Import Icon for toolbar buttons
import CatSprite from './CatSprite'; // Import CatSprite for thumbnail

const CostumesArea = () => {
  // Placeholder data for costumes
  const costumes = [
    { id: 1, name: 'costume1', width: 96, height: 100 },
    { id: 2, name: 'costume2', width: 62, height: 100 },
  ];
  // const selectedCostume = costumes[0]; // Assume first costume is selected
  const [selectedCostumeId, setSelectedCostumeId] = useState(costumes[0]?.id); // State for selected costume ID

  const selectedCostume = costumes.find(c => c.id === selectedCostumeId);

  const handleCostumeClick = (id) => {
    setSelectedCostumeId(id);
    // TODO: Integrate with SpriteContext to update the actual sprite's costume
  };

  return (
    <div className="flex flex-1 h-full overflow-hidden bg-gray-100">
      {/* Left Panel: Costume List */}
      <div className="w-24 flex-none h-full overflow-y-auto p-2 border-r border-gray-300 bg-white">
        {costumes.map((costume, index) => (
          <div
            key={costume.id}
            onClick={() => handleCostumeClick(costume.id)} // Add onClick handler
            className={`p-1 mb-2 border rounded cursor-pointer ${selectedCostumeId === costume.id ? 'border-blue-500 bg-blue-100' : 'border-gray-300 hover:bg-gray-50'}`}
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span>{index + 1}</span>
              {/* Placeholder for delete icon */}
              <button className="text-gray-400 hover:text-red-500">x</button>
            </div>
            {/* Use CatSprite as placeholder thumbnail */}
            <div className="w-16 h-16 mx-auto flex items-center justify-center bg-gray-200 rounded overflow-hidden">
              <div style={{ transform: 'scale(0.3)', transformOrigin: 'center' }}>
                <CatSprite />
              </div>
            </div>
            <div className="text-center text-xs mt-1">{costume.name}</div>
            <div className="text-center text-xs text-gray-500">{costume.width} x {costume.height}</div>
          </div>
        ))}
        {/* Add Costume Button Placeholder */}
        <button className="w-full mt-2 p-2 text-center text-xs bg-blue-500 text-white rounded hover:bg-blue-600">Add Costume</button>
      </div>

      {/* Right Panel: Editing Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Toolbar */}
        <div className="flex items-center justify-center p-1 space-x-2 bg-gray-200 border-b border-gray-300">
          {/* Placeholder Icons - Replace with actual Icon component usage if available */}
          <button className="p-1 hover:bg-gray-300 rounded"><Icon name="tool-group" size={18} /></button>
          <button className="p-1 hover:bg-gray-300 rounded"><Icon name="tool-ungroup" size={18} /></button>
          <div className="border-l h-5 mx-1"></div>
          <button className="p-1 hover:bg-gray-300 rounded"><Icon name="tool-forward" size={18} /></button>
          <button className="p-1 hover:bg-gray-300 rounded"><Icon name="tool-backward" size={18} /></button>
          <button className="p-1 hover:bg-gray-300 rounded"><Icon name="tool-front" size={18} /></button>
          <button className="p-1 hover:bg-gray-300 rounded"><Icon name="tool-back" size={18} /></button>
          <div className="border-l h-5 mx-1"></div>
          <button className="p-1 hover:bg-gray-300 rounded"><Icon name="edit-copy" size={18} /></button>
          <button className="p-1 hover:bg-gray-300 rounded"><Icon name="edit-paste" size={18} /></button>
          <button className="p-1 hover:bg-gray-300 rounded"><Icon name="edit-delete" size={18} /></button>
          <div className="border-l h-5 mx-1"></div>
          <button className="p-1 hover:bg-gray-300 rounded"><Icon name="flip-horizontal" size={18} /></button>
          <button className="p-1 hover:bg-gray-300 rounded"><Icon name="flip-vertical" size={18} /></button>
        </div>

        {/* Main Editing Canvas Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Toolbar */} 
          <div className="w-12 flex-none flex flex-col items-center p-1 space-y-1 bg-gray-200 border-r border-gray-300">
            {/* Placeholder Icons */}
            <button className="p-1 hover:bg-gray-300 rounded"><Icon name="tool-select" size={20} /></button>
            <button className="p-1 hover:bg-gray-300 rounded"><Icon name="tool-reshape" size={20} /></button>
            <button className="p-1 hover:bg-gray-300 rounded"><Icon name="tool-brush" size={20} /></button>
            <button className="p-1 hover:bg-gray-300 rounded"><Icon name="tool-eraser" size={20} /></button>
            <button className="p-1 hover:bg-gray-300 rounded"><Icon name="tool-fill" size={20} /></button>
            <button className="p-1 hover:bg-gray-300 rounded"><Icon name="tool-text" size={20} /></button>
            <button className="p-1 hover:bg-gray-300 rounded"><Icon name="tool-line" size={20} /></button>
            <button className="p-1 hover:bg-gray-300 rounded"><Icon name="tool-circle" size={20} /></button>
            <button className="p-1 hover:bg-gray-300 rounded"><Icon name="tool-rectangle" size={20} /></button>
          </div>

          {/* Canvas */} 
          <div className="flex-1 flex items-center justify-center bg-white relative overflow-auto" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            {/* Placeholder for the actual costume image being edited - Use selectedCostume */} 
            <div style={{ transform: 'scale(1.5)', transformOrigin: 'center' }}>
              {/* Conditionally render based on selected costume - simplistic example */} 
              {selectedCostume?.name === 'costume1' ? <CatSprite /> : <div className="w-16 h-16 bg-red-200 rounded">Costume 2 Placeholder</div>}
            </div>
            {/* Zoom controls */}
            <div className="absolute bottom-2 right-2 flex items-center bg-gray-200 rounded p-1">
              <button className="px-1"><Icon name="zoom-out" size={16} /></button>
              <span className="px-1 text-xs">100%</span>
              <button className="px-1"><Icon name="zoom-in" size={16} /></button>
              <button className="px-1 ml-1"><Icon name="zoom-reset" size={16} /></button>
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="flex items-center p-1 space-x-2 bg-gray-200 border-t border-gray-300">
          <span className="text-xs font-semibold ml-2">Costume: {selectedCostume?.name || 'None'}</span>
          <div className="flex-grow"></div> {/* Spacer */} 
          <label className="text-xs flex items-center">Fill: <button className="w-5 h-5 bg-purple-500 border border-gray-400 rounded ml-1"></button></label>
          <label className="text-xs flex items-center">Outline: <input type="number" defaultValue="4" className="w-8 h-5 text-xs border rounded px-1 ml-1" /></label>
          <button className="text-xs px-2 py-0.5 bg-blue-500 text-white rounded hover:bg-blue-600">Convert to Bitmap</button>
        </div>
      </div>
    </div>
  );
};

export default CostumesArea;