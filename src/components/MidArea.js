import React, { useState } from "react"; // Import useState
import AnimationBlock from './AnimationBlock';
import { useSprite } from "../context/SpriteContext";
import Icon from "./Icon";
import PreviewArea from './PreviewArea';
import CostumesArea from './CostumesArea'; // Import CostumesArea
import SoundsArea from './SoundsArea'; // Import SoundsArea
import SpriteList from './SpriteList'; // Import SpriteList

export default function MidArea() {
  const {
    sprites,
    activeSprite,
    addAnimation,
    removeAnimation,
    playAnimations,
    stopAnimations,
    isPlaying,
    addSprite,
    updateAnimation,
    ANIMATION_TYPES,
    setActiveSprite, // Added setActiveSprite for sprite list interaction
  } = useSprite();

  const [activeTab, setActiveTab] = useState('code'); // State for active tab

  const currentSprite = sprites.find((s) => s.id === activeSprite);

  const handleDrop = (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("application/reactflow");
    if (!data) return;

    try {
      const { type, text } = JSON.parse(data);
      // Basic parsing - needs refinement for values
      let animationData = { type };
      switch (type) {
        case ANIMATION_TYPES.MOVE:
          animationData.value = 10; // Default value
          break;
        case ANIMATION_TYPES.TURN:
          // Distinguish between clockwise and counter-clockwise based on text
          animationData.value = text.includes("↻") ? 15 : -15; // Default value
          break;
        case ANIMATION_TYPES.GOTO:
          animationData.x = 0; // Default value
          animationData.y = 0; // Default value
          break;
        case ANIMATION_TYPES.SAY:
          animationData.value = "Hello!"; // Default value
          animationData.duration = 2; // Default value
          break;
        case ANIMATION_TYPES.THINK:
          animationData.value = "Hmm..."; // Default value
          animationData.duration = 2; // Default value
          break;
        case ANIMATION_TYPES.REPEAT:
          animationData.count = 10; // Default value
          animationData.animations = []; // Placeholder for nested
          break;
        default:
          break;
      }
      if (activeSprite) {
        addAnimation(activeSprite, animationData);
      }
    } catch (error) {
      console.error("Failed to parse dropped data:", error);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const currentSpriteInfo = sprites.find(s => s.id === activeSprite);

  // Component for the Code/Scripting Area
  const CodeArea = () => (
    <div
      className="flex-1 h-full overflow-auto p-4 bg-white border-l border-gray-300 relative" // Changed background to white, removed style
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="space-y-1">
        {currentSprite && currentSprite.animations.length > 0 ? (
          currentSprite.animations.map((animation, index) => (
            <AnimationBlock
              key={index}
              animation={animation}
              index={index}
              updateAnimation={updateAnimation}
              removeAnimation={removeAnimation}
              activeSprite={activeSprite}
              ANIMATION_TYPES={ANIMATION_TYPES}
            />
          ))
        ) : (
          <p className="text-gray-400 italic text-center mt-10">Drop blocks here to build a script!</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-1 h-full overflow-hidden">
      {/* Scripting/Costumes/Sounds Column */} 
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Tabs */} 
        <div className="flex border-b border-gray-300 bg-gray-100">
          <button 
            onClick={() => setActiveTab('code')}
            className={`px-4 py-2 border-r border-gray-300 font-semibold ${activeTab === 'code' ? 'bg-white text-blue-600' : 'text-gray-600 hover:bg-gray-200'}`}
          >
            Code
          </button>
          <button 
            onClick={() => setActiveTab('costumes')}
            className={`px-4 py-2 border-r border-gray-300 ${activeTab === 'costumes' ? 'bg-white text-blue-600 font-semibold' : 'text-gray-600 hover:bg-gray-200'}`}
          >
            Costumes
          </button>
          <button 
            onClick={() => setActiveTab('sounds')}
            className={`px-4 py-2 ${activeTab === 'sounds' ? 'bg-white text-blue-600 font-semibold' : 'text-gray-600 hover:bg-gray-200'}`}
          >
            Sounds
          </button>
        </div>
        {/* Content Area based on active tab */} 
        {activeTab === 'code' && <CodeArea />} 
        {activeTab === 'costumes' && <CostumesArea />} 
        {activeTab === 'sounds' && <SoundsArea />} 
      </div>

      {/* Stage and Sprites Column */} 
      <div className="w-[480px] flex-none h-full flex flex-col bg-gray-100 border-l border-gray-300"> // Increased width
        {/* Stage Controls */} 
        <div className="flex justify-end items-center p-2 space-x-2 bg-gray-200 border-b border-gray-300">
          <button onClick={playAnimations} disabled={isPlaying} className="p-1 rounded bg-green-500 hover:bg-green-600 disabled:opacity-50">
            <Icon name="flag" size={20} className="text-white" />
          </button>
          <button onClick={stopAnimations} disabled={!isPlaying} className="p-1 rounded bg-red-500 hover:bg-red-600 disabled:opacity-50">
            <Icon name="stop" size={20} className="text-white" />
          </button>
        </div>
        {/* Stage Area */} 
        <div className="flex-grow relative bg-white m-2 border border-gray-400 rounded overflow-hidden">
          <PreviewArea />
        </div>
        {/* Sprite Info and List */} 
        <div className="p-2 border-t border-gray-300 bg-gray-50 h-48 overflow-y-auto">
          <div className="font-semibold mb-2">Sprite</div>
          {/* Sprite Details Placeholder */} 
          {currentSpriteInfo && (
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm mb-3">
              <span>Sprite:</span><span>{currentSpriteInfo.name}</span>
              <label htmlFor="sprite-x">x:</label><input id="sprite-x" type="number" value={Math.round(currentSpriteInfo.x)} readOnly className="border rounded px-1 w-16" />
              <label htmlFor="sprite-y">y:</label><input id="sprite-y" type="number" value={Math.round(currentSpriteInfo.y)} readOnly className="border rounded px-1 w-16" />
              <span>Show:</span><span>👁️</span> {/* Placeholder */} 
              <label htmlFor="sprite-size">Size:</label><input id="sprite-size" type="number" value={100} readOnly className="border rounded px-1 w-16" /> {/* Placeholder */} 
              <label htmlFor="sprite-dir">Direction:</label><input id="sprite-dir" type="number" value={Math.round(currentSpriteInfo.direction)} readOnly className="border rounded px-1 w-16" />
            </div>
          )}
          {/* Sprite List Area - Replace inline list with SpriteList component */} 
          <div className="border-t pt-2 h-[calc(100%-80px)]"> {/* Adjust height as needed */} 
            <SpriteList />
          </div>
        </div>
        {/* Backdrop Area Placeholder */} 
        <div className="p-2 border-t border-gray-300 bg-gray-50 h-24">
          <div className="font-semibold mb-1">Stage</div>
          <div className="text-xs text-gray-500">Backdrops (1)</div>
          {/* Placeholder for backdrop thumbnail */} 
        </div>
      </div>
    </div>
  );
}
