import React, { useRef, useEffect, useState } from "react";
import { useSprite } from "../context/SpriteContext";
import CatSprite from "./CatSprite";

export default function PreviewArea() {
  const { sprites, updateSpritePosition } = useSprite(); // Add updateSpritePosition
  const [collisionMessage, setCollisionMessage] = useState("");
  const prevSpritesRef = useRef([]);

  useEffect(() => {
    // Detect animation swap by comparing animations between frames
    if (prevSpritesRef.current.length && sprites.length > 1) {
      for (let i = 0; i < sprites.length; i++) {
        const prev = prevSpritesRef.current[i];
        const curr = sprites[i];
        if (
          prev &&
          curr &&
          prev.animations !== curr.animations &&
          prev.animations.length > 0 &&
          curr.animations.length > 0 &&
          prev.animations[0] !== curr.animations[0]
        ) {
          setCollisionMessage(
            `Collision! ${prev.name} and ${curr.name} swapped animations.`
          );
          setTimeout(() => setCollisionMessage(""), 1500);
          break;
        }
      }
    }
    prevSpritesRef.current = sprites.map(s => ({ ...s }));
  }, [sprites]);

  const handleDragStart = (e, spriteId) => {
    e.dataTransfer.setData("spriteId", spriteId);
    // Optional: Set drag image if needed
    // e.dataTransfer.setDragImage(e.target, 0, 0);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const spriteId = parseInt(e.dataTransfer.getData("spriteId"), 10);
    if (!spriteId) return;

    const stageRect = e.currentTarget.getBoundingClientRect();
    // Calculate drop position relative to the stage center (0,0)
    const x = e.clientX - stageRect.left - stageRect.width / 2;
    const y = -(e.clientY - stageRect.top - stageRect.height / 2); // Invert Y-axis

    updateSpritePosition(spriteId, x, y);
  };

  return (
    <div
      className="relative w-full h-full flex items-center justify-center"
      style={{ minHeight: 360, minWidth: 480, background: "#fff" }}
    >
      <div
        className="relative"
        style={{ width: 480, height: 360, background: "#fff", border: "2px solid #bbb", borderRadius: 12, overflow: "hidden" }}
        onDragOver={handleDragOver} // Add drag over handler to the stage
        onDrop={handleDrop} // Add drop handler to the stage
      >
        {collisionMessage && (
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-4 py-2 rounded shadow-lg z-50 animate-pulse">
            {collisionMessage}
          </div>
        )}
        {sprites.map((sprite) => (
          <div
            key={sprite.id}
            draggable // Make the sprite draggable
            onDragStart={(e) => handleDragStart(e, sprite.id)} // Add drag start handler
            className="absolute transition-transform duration-100 ease-linear cursor-grab" // Add cursor style
            style={{
              left: `calc(50% + ${sprite.x}px)` ,
              top: `calc(50% + ${-sprite.y}px)` ,
              transform: `translate(-50%, -50%) rotate(${sprite.direction - 90}deg)` ,
              transformOrigin: 'center center'
            }}
          >
            <div style={{ transform: 'scale(0.85)', transformOrigin: 'center center' }}> {/* Adjusted scale for Scratch-like size */}
              <CatSprite />
            </div>
            {sprite.saying && (
              <div className="absolute bottom-full mb-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-sm rounded py-2 px-3 whitespace-nowrap shadow-lg z-10 pointer-events-none"> {/* Added pointer-events-none */}
                {sprite.saying}
                <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-1 w-0 h-0 border-l-5 border-l-transparent border-r-5 border-r-transparent border-t-5 border-t-blue-600"></div>
              </div>
            )}
            {sprite.thinking && (
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-300 text-black text-xs rounded-full py-1 px-3 shadow pointer-events-none"> {/* Added pointer-events-none */}
                {sprite.thinking}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
