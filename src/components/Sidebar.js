import React, { useState } from "react";
import Icon from "./Icon";
import { useSprite } from "../context/SpriteContext";
// Removed SearchBar import

const DraggableBlock = ({ type, text, color, children, onDragStart, onClick, style }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData("application/reactflow", JSON.stringify({ type, text }));
    e.dataTransfer.effectAllowed = "move";
    if (onDragStart) onDragStart(e);
  };
  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={onClick}
      className={`flex flex-row flex-wrap ${color} text-white px-2 py-1 my-2 text-sm cursor-pointer rounded`}
      style={style}
    >
      {text}
      {children}
    </div>
  );
};

export default function Sidebar() {
  const { ANIMATION_TYPES, executeSingleAnimation, activeSprite } = useSprite(); // Use executeSingleAnimation
  // Removed search state

  const handleBlockClick = (animation) => {
    if (activeSprite !== null) {
      // Execute the animation immediately instead of adding it to the queue
      executeSingleAnimation(activeSprite, animation);
    }
  };

  // Block definitions for filtering
  const blocks = [
    {
      section: "Motion",
      items: [
        { type: ANIMATION_TYPES.MOVE, text: "Move 10 steps", color: "bg-blue-500", onClick: () => handleBlockClick({ type: ANIMATION_TYPES.MOVE, value: 10 }) },
        { type: ANIMATION_TYPES.TURN, text: "Turn ↻ 15 degrees", color: "bg-blue-500", onClick: () => handleBlockClick({ type: ANIMATION_TYPES.TURN, value: 15 }) },
        { type: ANIMATION_TYPES.TURN, text: "Turn ↺ 15 degrees", color: "bg-blue-500", onClick: () => handleBlockClick({ type: ANIMATION_TYPES.TURN, value: -15 }) },
        { type: ANIMATION_TYPES.GOTO, text: "Go to x: 0 y: 0", color: "bg-blue-500", onClick: () => handleBlockClick({ type: ANIMATION_TYPES.GOTO, x: 0, y: 0 }) },
      ]
    },
    {
      section: "Looks",
      items: [
        { type: ANIMATION_TYPES.SAY, text: "Say Hello! for 2 secs", color: "bg-purple-500", onClick: () => handleBlockClick({ type: ANIMATION_TYPES.SAY, value: 'Hello!', duration: 2 }) },
        { type: ANIMATION_TYPES.THINK, text: "Think Hmm... for 2 secs", color: "bg-purple-500", onClick: () => handleBlockClick({ type: ANIMATION_TYPES.THINK, value: 'Hmm...', duration: 2 }) },
      ]
    },
    {
      section: "Control",
      items: [
        { type: ANIMATION_TYPES.REPEAT, text: "Repeat 10 times", color: "bg-yellow-500", onClick: () => handleBlockClick({ type: ANIMATION_TYPES.REPEAT, count: 10, animations: [] }) },
      ]
    }
  ];

  // No filtering needed now
  // const filteredBlocks = blocks.map(section => ({
  //   ...section,
  //   items: section.items.filter(block => block.text.toLowerCase().includes(search.toLowerCase()))
  // })).filter(section => section.items.length > 0);

  return (
    // Adjusted width, background, padding to match Scratch more closely
    <div className="w-72 flex-none h-full overflow-y-auto flex flex-col items-start p-3 bg-white border-r border-gray-300 space-y-4">
      {/* Removed SearchBar */} 
      {blocks.map(section => (
        <div key={section.section} className="w-full">
          <div className="font-bold text-xs text-gray-500 uppercase tracking-wider mb-1">{section.section}</div>
          {section.items.map((block, idx) => (
            <DraggableBlock key={block.text + idx} {...block} />
          ))}
        </div>
      ))}
    </div>
  );
}
