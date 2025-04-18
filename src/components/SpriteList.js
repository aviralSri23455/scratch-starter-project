import React, { useState } from 'react';
import { useSprite } from '../context/SpriteContext';
import CatSprite from './CatSprite'; // Assuming a small preview

export default function SpriteList() {
  const { sprites, activeSprite, setActiveSprite, addSprite } = useSprite();
  const [search, setSearch] = useState("");
  const filteredSprites = sprites.filter(sprite => sprite.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col items-center p-2 bg-gray-100 border-t border-gray-300 h-full">
      <h3 className="text-sm font-semibold mb-2">Sprites</h3>
      <input
        type="text"
        placeholder="Search sprites..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-2 px-2 py-1 rounded border w-full text-sm"
      />
      <div className="flex-grow overflow-y-auto space-y-2 mb-2 w-full flex flex-col items-center">
        {filteredSprites.map((sprite) => (
          <button
            key={sprite.id}
            onClick={() => setActiveSprite(sprite.id)}
            className={`p-1 rounded border-2 ${activeSprite === sprite.id ? 'border-blue-500' : 'border-transparent hover:border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-400`}
            title={`Select ${sprite.name}`}
          >
            {/* Use CatSprite as a thumbnail */}
            <div className="w-12 h-12 bg-white rounded flex items-center justify-center overflow-hidden p-1">
              {/* Scale down the CatSprite using SVG transform or CSS */}
              <div style={{ transform: 'scale(0.4)', transformOrigin: 'top left' }}>
                 <CatSprite />
              </div>
            </div>
            <p className="text-xs mt-1 text-center">{sprite.name}</p>
          </button>
        ))}
      </div>
      <button
        onClick={addSprite}
        className="mt-auto bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded"
      >
        Add Sprite
      </button>
    </div>
  );
}