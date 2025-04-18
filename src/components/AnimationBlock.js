import React, { useState } from 'react';

const AnimationBlock = ({ animation, index, updateAnimation, removeAnimation, activeSprite, ANIMATION_TYPES }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({ ...animation });

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setEditValues(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value }));
  };

  const handleSave = () => {
    // Ensure Turn value sign is preserved if edited via absolute value input
    if (editValues.type === ANIMATION_TYPES.TURN && animation.value < 0 && editValues.value > 0) {
      editValues.value = -editValues.value;
    }
    updateAnimation(activeSprite, index, editValues);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValues({ ...animation }); // Reset changes
  };

  let text = `Unknown: ${animation.type}`;
  let color = "bg-gray-400";

  switch (animation.type) {
    case ANIMATION_TYPES.MOVE:
      text = isEditing ? (
        <>
          Move <input type="number" name="value" value={editValues.value} onChange={handleInputChange} className="w-10 mx-1 text-black rounded px-1" /> steps
        </>
      ) : `Move ${animation.value} steps`;
      color = "bg-blue-500";
      break;
    case ANIMATION_TYPES.TURN:
      text = isEditing ? (
        <>
          Turn {animation.value >= 0 ? "↻" : "↺"} <input type="number" name="value" value={Math.abs(editValues.value)} onChange={handleInputChange} className="w-10 mx-1 text-black rounded px-1" /> degrees
        </>
      ) : `Turn ${animation.value >= 0 ? "↻" : "↺"} ${Math.abs(animation.value)} degrees`;
      color = "bg-blue-500";
      break;
    case ANIMATION_TYPES.GOTO:
      text = isEditing ? (
        <>
          Go to x: <input type="number" name="x" value={editValues.x} onChange={handleInputChange} className="w-10 mx-1 text-black rounded px-1" />
          y: <input type="number" name="y" value={editValues.y} onChange={handleInputChange} className="w-10 ml-1 text-black rounded px-1" />
        </>
      ) : `Go to x: ${animation.x} y: ${animation.y}`;
      color = "bg-blue-500";
      break;
    case ANIMATION_TYPES.SAY:
      text = isEditing ? (
        <>
          Say <input type="text" name="value" value={editValues.value} onChange={handleInputChange} className="mx-1 text-black rounded px-1 flex-grow" />
          for <input type="number" name="duration" value={editValues.duration} onChange={handleInputChange} className="w-10 ml-1 text-black rounded px-1" /> secs
        </>
      ) : `Say ${animation.value} for ${animation.duration} secs`;
      color = "bg-purple-500";
      break;
    case ANIMATION_TYPES.THINK:
      text = isEditing ? (
        <>
          Think <input type="text" name="value" value={editValues.value} onChange={handleInputChange} className="mx-1 text-black rounded px-1 flex-grow" />
          for <input type="number" name="duration" value={editValues.duration} onChange={handleInputChange} className="w-10 ml-1 text-black rounded px-1" /> secs
        </>
      ) : `Think ${animation.value} for ${animation.duration} secs`;
      color = "bg-purple-500";
      break;
    case ANIMATION_TYPES.REPEAT:
      text = isEditing ? (
        <>
          Repeat <input type="number" name="count" value={editValues.count} onChange={handleInputChange} className="w-10 mx-1 text-black rounded px-1" /> times
        </>
      ) : `Repeat ${animation.count} times`;
      color = "bg-yellow-500";
      break;
    default:
      text = `Unknown: ${animation.type}`;
      break;
  }

  return (
    <div
      className={`flex flex-col ${color} text-white px-2 py-1 my-1 text-sm rounded`}
    >
      <div className="flex justify-between items-center w-full">
        <span className={`flex-grow ${!isEditing ? 'cursor-pointer' : ''}`} onClick={() => !isEditing && setIsEditing(true)}>{text}</span>
        {!isEditing ? (
          <button
            onClick={() => removeAnimation(activeSprite, index)}
            className="text-red-300 hover:text-red-500 ml-2 flex-shrink-0"
            title="Remove"
          >
            X
          </button>
        ) : (
          <div className="flex space-x-1 flex-shrink-0 ml-2">
            <button onClick={handleSave} className="text-green-300 hover:text-green-500">✓</button>
            <button onClick={handleCancel} className="text-red-300 hover:text-red-500">X</button>
          </div>
        )}
      </div>
      {/* Placeholder for nested blocks in Repeat */}
      {animation.type === ANIMATION_TYPES.REPEAT && (
        <div className="ml-4 mt-1 border-l-2 border-yellow-300 pl-2">
          <span className="text-xs italic text-yellow-200">Nested blocks go here</span>
        </div>
      )}
    </div>
  );
};

export default AnimationBlock;