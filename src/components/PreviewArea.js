import React, { useRef, useEffect, useState } from "react";
import { useSprite } from "../context/SpriteContext";
import CatSprite from "./CatSprite";

// Define stage dimensions
const STAGE_WIDTH = 480;
const STAGE_HEIGHT = 360;
const SPRITE_HEIGHT = 80; // Approximate height, should match SpriteContext

export default function PreviewArea() {
  const { sprites, updateSpritePosition } = useSprite(); // Add updateSpritePosition
  const [collisionMessage, setCollisionMessage] = useState("");
  const prevSpritesRef = useRef([]);
  const stageRef = useRef(null);

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
    
    // Invert Y-axis to match Scratch coordinate system (positive Y is up)
    let y = -(e.clientY - stageRect.top - stageRect.height / 2);

    // Apply boundary checking for x coordinate
    const SPRITE_WIDTH = 80; // Should match the value in SpriteContext
    const boundedX = Math.max(-(STAGE_WIDTH/2) + SPRITE_WIDTH/2, Math.min(x, (STAGE_WIDTH/2) - SPRITE_WIDTH/2));

    // Apply boundary checking for y coordinate
    const boundedY = Math.max(-(STAGE_HEIGHT/2) + SPRITE_HEIGHT/2, Math.min(y, (STAGE_HEIGHT/2) - SPRITE_HEIGHT/2));

    updateSpritePosition(spriteId, boundedX, boundedY);
  };

  return (
    <div className="flex-none h-full w-full overflow-hidden p-2">
      <div 
        ref={stageRef}
        className="w-full h-full bg-white rounded-lg flex items-center justify-center relative"
        style={{
          width: `${STAGE_WIDTH}px`,
          height: `${STAGE_HEIGHT}px`,
          margin: '0 auto',
          border: '2px solid #ddd',
          overflow: 'hidden'
        }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Stage center coordinates indicator */}
        <div className="absolute" style={{ left: STAGE_WIDTH/2, top: STAGE_HEIGHT/2, width: 2, height: 2, backgroundColor: '#ccc' }}></div>
        
        {sprites.map((sprite) => (
          <div
            key={sprite.id}
            className="absolute"
            style={{
              transform: `translate(${sprite.x + STAGE_WIDTH / 2 - 50}px, ${-sprite.y + STAGE_HEIGHT / 2 - 200}px) rotate(${90 - sprite.direction}deg)`,
              transition: 'transform 0.5s ease',
              zIndex: sprite.saying || sprite.thinking ? 10 : 1
            }}
            draggable
            onDragStart={(e) => handleDragStart(e, sprite.id)}
          >
            <CatSprite />
            {sprite.saying && (
              <div className="absolute top-0 left-full ml-2 bg-white border border-gray-300 rounded-lg p-2 text-sm z-20 whitespace-nowrap">
                {sprite.saying}
              </div>
            )}
            {sprite.thinking && (
              <div className="absolute top-0 left-full ml-2 bg-white border border-gray-300 rounded-lg p-2 text-sm z-20 whitespace-nowrap">
                <span className="font-bold">🤔</span> {sprite.thinking}
              </div>
            )}
          </div>
        ))}
        {collisionMessage && (
          <div className="absolute top-2 left-2 bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-2 rounded-md z-30">
            {collisionMessage}
          </div>
        )}
      </div>
    </div>
  );
}
