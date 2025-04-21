import React, { createContext, useState, useContext, useEffect } from 'react';

const SpriteContext = createContext();

export const useSprite = () => useContext(SpriteContext);

export const SpriteProvider = ({ children }) => {
  // Animation types - moved to the top to fix reference error
  const ANIMATION_TYPES = {
    MOVE: 'move',
    TURN: 'turn',
    GOTO: 'goto',
    REPEAT: 'repeat',
    SAY: 'say',
    THINK: 'think',
  };

  // Default animation data for repeat blocks
  const DEFAULT_REPEAT_ANIMATIONS = [
    { type: 'MOVE', value: 10 }
  ];
  
  const [sprites, setSprites] = useState([
    {
      id: 1,
      name: 'Cat 1',
      component: 'CatSprite',
      x: -200, // Position on the left side
      y: 0, // Center vertically
      direction: 90,
     // degrees (90 is pointing right)
      animations: [
        { type: ANIMATION_TYPES.MOVE, value: 10 } // Move right
      ],
      currentAnimationIndex: 0, // Track animation progress
      saying: '',
      thinking: '',
      sayingTimer: null,
      thinkingTimer: null,
      // Add state for repeat loops
      repeatCounters: {}, // { animationIndex: countRemaining }
    },
    {
      id: 2,
      name: 'Cat 2',
      component: 'CatSprite',
      x: -200, // Position on the left side
      y: 0, // Center vertically
      direction: 90, // degrees (90 is pointing right)
      animations: [
        { type: ANIMATION_TYPES.MOVE, value: -10 } // Move left
      ],
      currentAnimationIndex: 0,
      saying: '',
      thinking: '',
      sayingTimer: null,
      thinkingTimer: null,
      repeatCounters: {},
    },
  ]);

  const [activeSprite, setActiveSprite] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  // Use an object to store interval IDs for each sprite
  const intervalIdsRef = React.useRef({});

  // Add a new sprite
  const addSprite = () => {
    const newId = sprites.length > 0 ? Math.max(...sprites.map(s => s.id)) + 1 : 1;
    setSprites([
      ...sprites,
      {
        id: newId,
        name: `Sprite ${newId}`,
        component: 'CatSprite',
        x: 0,
        y: 100, // Position higher on stage
        direction: 90,
        animations: [],
        currentAnimationIndex: 0, // Track animation progress
        saying: '',
        thinking: '',
        sayingTimer: null,
        thinkingTimer: null,
        repeatCounters: {}, // Initialize repeat counters for consistency
      },
    ]);
    setActiveSprite(newId);
  };

  // Add animation to a sprite
  const addAnimation = (spriteId, animation) => {
    setSprites(sprites.map(sprite => {
      if (sprite.id === spriteId) {
        return {
          ...sprite,
          animations: [...sprite.animations, animation],
        };
      }
      return sprite;
    }));
  };

  // Update an animation for a sprite
  const updateAnimation = (spriteId, animationIndex, updatedAnimation) => {
    setSprites(sprites.map(sprite => {
      if (sprite.id === spriteId) {
        const newAnimations = [...sprite.animations];
        if (animationIndex >= 0 && animationIndex < newAnimations.length) {
          newAnimations[animationIndex] = { ...newAnimations[animationIndex], ...updatedAnimation };
        }
        return {
          ...sprite,
          animations: newAnimations,
        };
      }
      return sprite;
    }));
  };

  // Remove animation from a sprite
  const removeAnimation = (spriteId, animationIndex) => {
    setSprites(sprites.map(sprite => {
      if (sprite.id === spriteId) {
        const newAnimations = [...sprite.animations];
        newAnimations.splice(animationIndex, 1);
        return {
          ...sprite,
          animations: newAnimations,
        };
      }
      return sprite;
    }));
  };

  // Stage boundaries for collision detection
  const STAGE_WIDTH = 480;
  const STAGE_HEIGHT = 360;
  const SPRITE_WIDTH = 80; // Approximate width of the cat sprite
  const SPRITE_HEIGHT = 80; // Approximate height, should match PreviewArea
  
  const executeAnimation = (sprite, animation) => {
    const { type, value, duration, x, y } = animation;
    switch (type) {
      case ANIMATION_TYPES.MOVE:
        // Move horizontally (left and right)
        const newX = sprite.x + value;
        
        // Boundary checking to keep sprite within stage
        const boundedX = Math.max(-(STAGE_WIDTH/2) + SPRITE_WIDTH/2, Math.min(newX, (STAGE_WIDTH/2) - SPRITE_WIDTH/2));
        
        // Ensure sprite stays in the upper part of the stage for visibility
        // Set a minimum y value to keep the sprite visible
        const minY = 0; // Keep at or above the center line
        
        return {
          ...sprite,
          x: boundedX,
          // Ensure y position is at least minY
          y: Math.max(sprite.y, minY),
        };
      case ANIMATION_TYPES.TURN:
        return {
          ...sprite,
          direction: (sprite.direction + value) % 360,
        };
      case ANIMATION_TYPES.GOTO:
        // Apply boundary checking for x coordinate
        const boundedGotoX = Math.max(-(STAGE_WIDTH/2) + SPRITE_WIDTH/2, Math.min(x, (STAGE_WIDTH/2) - SPRITE_WIDTH/2));
        
        // Apply boundary checking for y coordinate
        const boundedGotoY = Math.max(-(STAGE_HEIGHT/2) + SPRITE_HEIGHT/2, Math.min(y, (STAGE_HEIGHT/2) - SPRITE_HEIGHT/2));

        return {
          ...sprite,
          x: boundedGotoX,
          y: boundedGotoY,
        };
      case ANIMATION_TYPES.SAY:
        if (sprite.sayingTimer) {
          clearTimeout(sprite.sayingTimer);
        }
        if (sprite.thinkingTimer) {
          clearTimeout(sprite.thinkingTimer);
        }
        const sayingTimer = duration ? setTimeout(() => {
          setSprites(prevSprites => prevSprites.map(s =>
            s.id === sprite.id ? { ...s, saying: '', sayingTimer: null } : s
          ));
        }, duration * 1000) : null;
        return {
          ...sprite,
          saying: value,
          thinking: '',
          thinkingTimer: null,
          sayingTimer,
        };
      case ANIMATION_TYPES.THINK:
        if (sprite.thinkingTimer) {
          clearTimeout(sprite.thinkingTimer);
        }
        if (sprite.sayingTimer) {
          clearTimeout(sprite.sayingTimer);
        }
        const thinkingTimer = duration ? setTimeout(() => {
          setSprites(prevSprites => prevSprites.map(s =>
            s.id === sprite.id ? { ...s, thinking: '', thinkingTimer: null } : s
          ));
        }, duration * 1000) : null;
        return {
          ...sprite,
          thinking: value,
          saying: '',
          sayingTimer: null,
          thinkingTimer,
        };
      default:
        return sprite;
    }
  };

  // Execute a single animation immediately (e.g., on block click)
  const executeSingleAnimation = (spriteId, animation) => {
    setSprites(prevSprites =>
      prevSprites.map(sprite => {
        if (sprite.id === spriteId) {
          // Clear any existing speech/thought bubbles immediately
          if (sprite.sayingTimer) clearTimeout(sprite.sayingTimer);
          if (sprite.thinkingTimer) clearTimeout(sprite.thinkingTimer);
          const updatedSprite = executeAnimation({ ...sprite, saying: '', thinking: '' }, animation);
          return updatedSprite;
        }
        return sprite;
      })
    );
  };

  // Execute animations for all sprites
  const playAnimations = () => {
    // Reset animation index for all sprites before starting
    setSprites(prevSprites =>
      prevSprites.map(sprite => ({
        ...sprite,
        currentAnimationIndex: 0,
        repeatCounters: {},
        // Clear any lingering speech/thought bubbles
        saying: '',
        thinking: '',
        sayingTimer: sprite.sayingTimer ? clearTimeout(sprite.sayingTimer) : null,
        thinkingTimer: sprite.thinkingTimer ? clearTimeout(sprite.thinkingTimer) : null,
      }))
    );
    setIsPlaying(true);
  };

  // Stop animations
  const stopAnimations = () => {
    setIsPlaying(false);
    // Clear all intervals
    Object.values(intervalIdsRef.current).forEach(clearInterval);
    intervalIdsRef.current = {};

    // Reset animation progress and clear any speech/thought bubbles for ALL sprites
    setSprites(prevSprites =>
      prevSprites.map(sprite => {
        // Clear timers if they exist
        if (sprite.sayingTimer) clearTimeout(sprite.sayingTimer);
        if (sprite.thinkingTimer) clearTimeout(sprite.thinkingTimer);
        return {
          ...sprite,
          currentAnimationIndex: 0,
          repeatCounters: {},
          saying: '',
          thinking: '',
          sayingTimer: null,
          thinkingTimer: null,
        };
      })
    );
  };

  // Check for collisions between sprites
  // Accepts sprite list as argument to check current frame's positions
  const checkCollisions = (currentSprites) => {
    const collidedPairs = [];
    // Simple bounding box collision detection (adjust size as needed)
    const SPRITE_SIZE = 40; // Approximate size for collision check

    for (let i = 0; i < currentSprites.length; i++) {
      for (let j = i + 1; j < currentSprites.length; j++) {
        const sprite1 = currentSprites[i];
        const sprite2 = currentSprites[j];

        const dx = sprite1.x - sprite2.x;
        const dy = sprite1.y - sprite2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // If distance is less than the sum of their radii (approx), they collide
        if (distance < SPRITE_SIZE) { // Use SPRITE_SIZE as diameter approx.
          collidedPairs.push([sprite1.id, sprite2.id]);
        }
      }
    }

    return collidedPairs;
  };
+
  // Effect to handle animation execution when isPlaying changes
  useEffect(() => {
    if (isPlaying) {
      // Clear existing intervals before starting new ones
      Object.values(intervalIdsRef.current).forEach(clearInterval);
      intervalIdsRef.current = {};
  
      sprites.forEach(sprite => {
        if (sprite.animations.length > 0) {
          intervalIdsRef.current[sprite.id] = setInterval(() => {
            setSprites(prevSprites => {
              // Find the latest state of the current sprite
              const currentSpriteState = prevSprites.find(s => s.id === sprite.id);
              if (!currentSpriteState || currentSpriteState.animations.length === 0 || !isPlaying) {
                clearInterval(intervalIdsRef.current[sprite.id]);
                delete intervalIdsRef.current[sprite.id];
                if (Object.keys(intervalIdsRef.current).length === 0) {
                  setIsPlaying(false);
                }
                return prevSprites;
              }
  
              // --- Nested Animation Execution Helper ---
              function executeAnimationsList(sprite, animations, animIndex, repeatCounters) {
                let s = { ...sprite };
                let idx = animIndex;
                let counters = { ...repeatCounters };
                while (idx < animations.length) {
                  const anim = animations[idx];
                  if (anim.type === ANIMATION_TYPES.REPEAT) {
                    const repeatKey = `${idx}`;
                    let repeatCount = counters[repeatKey] !== undefined ? counters[repeatKey] : anim.count;
                    if (repeatCount > 0) {
                      if (Array.isArray(anim.animations) && anim.animations.length > 0) {
                        let nestedIndex = s[`nestedIndex_${repeatKey}`] ?? 0;
                        let nestedSprite = { ...s };
                        let nestedCounters = { ...counters };
                        if (nestedIndex < anim.animations.length) {
                          nestedSprite = executeAnimation(nestedSprite, anim.animations[nestedIndex]);
                          nestedSprite[`nestedIndex_${repeatKey}`] = nestedIndex + 1;
                          // Only increment nestedIndex, do not increment repeatCount here
                          return {
                            sprite: nestedSprite,
                            animIndex: idx,
                            repeatCounters: counters
                          };
                        } else {
                          // Finished one repeat cycle, reset nestedIndex and decrement repeatCount
                          repeatCount--;
                          counters[repeatKey] = repeatCount;
                          s[`nestedIndex_${repeatKey}`] = 0;
                          if (repeatCount > 0) {
                            // Start nested again
                            return {
                              sprite: s,
                              animIndex: idx,
                              repeatCounters: counters
                            };
                          } else {
                            // Move to next animation after repeat
                            delete counters[repeatKey];
                            delete s[`nestedIndex_${repeatKey}`];
                            idx++;
                            continue;
                          }
                        }
                      } else {
                        idx++;
                        continue;
                      }
                    } else {
                      delete counters[repeatKey];
                      delete s[`nestedIndex_${repeatKey}`];
                      idx++;
                      continue;
                    }
                  } else {
                    s = executeAnimation(s, anim);
                    idx++;
                    break;
                  }
                }
                return {
                  sprite: s,
                  animIndex: idx,
                  repeatCounters: counters
                };
              }
  
              let spriteToUpdate = { ...currentSpriteState };
              let animationIndex = spriteToUpdate.currentAnimationIndex;
              let repeatCounters = spriteToUpdate.repeatCounters || {};

              const result = executeAnimationsList(spriteToUpdate, spriteToUpdate.animations, animationIndex, repeatCounters);
              spriteToUpdate = result.sprite;
              spriteToUpdate.currentAnimationIndex = result.animIndex;
              spriteToUpdate.repeatCounters = result.repeatCounters;

              // If finished all animations, stop interval
              if (spriteToUpdate.currentAnimationIndex >= spriteToUpdate.animations.length) {
                clearInterval(intervalIdsRef.current[sprite.id]);
                delete intervalIdsRef.current[sprite.id];
                if (Object.keys(intervalIdsRef.current).length === 0) {
                  setIsPlaying(false);
                }
                spriteToUpdate.currentAnimationIndex = 0;
                spriteToUpdate.repeatCounters = {};
              }

              // --- Update the state for this specific sprite FIRST ---
              let spritesAfterAnimation = prevSprites.map(s => (s.id === sprite.id ? spriteToUpdate : s));

              // --- Collision Detection & Swapping ---
              const collisions = checkCollisions(spritesAfterAnimation);
              let spritesAfterCollision = spritesAfterAnimation;

              if (collisions.length > 0) {
                const swappedPairs = new Set();
                collisions.forEach(([id1, id2]) => {
                  const pairKey = [id1, id2].sort().join('-');
                  if (!swappedPairs.has(pairKey)) {
                    const index1 = spritesAfterCollision.findIndex(s => s.id === id1);
                    const index2 = spritesAfterCollision.findIndex(s => s.id === id2);
                    if (index1 !== -1 && index2 !== -1) {
                      const sprite1Anims = [...spritesAfterCollision[index1].animations];
                      const sprite2Anims = [...spritesAfterCollision[index2].animations];
                      spritesAfterCollision[index1] = {
                        ...spritesAfterCollision[index1],
                        animations: sprite2Anims,
                        currentAnimationIndex: 0,
                        repeatCounters: {},
                        saying: '', thinking: '',
                        sayingTimer: spritesAfterCollision[index1].sayingTimer ? clearTimeout(spritesAfterCollision[index1].sayingTimer) : null,
                        thinkingTimer: spritesAfterCollision[index1].thinkingTimer ? clearTimeout(spritesAfterCollision[index1].thinkingTimer) : null,
                      };
                      spritesAfterCollision[index2] = {
                        ...spritesAfterCollision[index2],
                        animations: sprite1Anims,
                        currentAnimationIndex: 0,
                        repeatCounters: {},
                        saying: '', thinking: '',
                        sayingTimer: spritesAfterCollision[index2].sayingTimer ? clearTimeout(spritesAfterCollision[index2].sayingTimer) : null,
                        thinkingTimer: spritesAfterCollision[index2].thinkingTimer ? clearTimeout(spritesAfterCollision[index2].thinkingTimer) : null,
                      };
                      swappedPairs.add(pairKey);
                    }
                  }
                });
              }

              return spritesAfterCollision;
            });
          }, 500);
        }
      });
    } else {
      Object.values(intervalIdsRef.current).forEach(clearInterval);
      intervalIdsRef.current = {};
    }
    return () => {
      Object.values(intervalIdsRef.current).forEach(clearInterval);
      intervalIdsRef.current = {};
    };
  }, [isPlaying]);

  // Update sprite position (e.g., from dragging)
  const updateSpritePosition = (spriteId, x, y) => {
    setSprites(sprites.map(sprite =>
      sprite.id === spriteId ? { ...sprite, x, y } : sprite
    ));
  };

  // Update sprite direction
  const updateSpriteDirection = (spriteId, direction) => {
    setSprites(sprites.map(sprite =>
      sprite.id === spriteId ? { ...sprite, direction } : sprite
    ));
  };

  // Update sprite name
  const updateSpriteName = (spriteId, name) => {
    setSprites(sprites.map(sprite =>
      sprite.id === spriteId ? { ...sprite, name } : sprite
    ));
  };

  // Delete a sprite
  const deleteSprite = (spriteId) => {
    setSprites(prevSprites => {
      const remainingSprites = prevSprites.filter(sprite => sprite.id !== spriteId);
      // If the deleted sprite was active, set a new active sprite
      if (activeSprite === spriteId) {
        setActiveSprite(remainingSprites.length > 0 ? remainingSprites[0].id : null);
      }
      // Clear interval for the deleted sprite
      if (intervalIdsRef.current[spriteId]) {
        clearInterval(intervalIdsRef.current[spriteId]);
        delete intervalIdsRef.current[spriteId];
      }
      return remainingSprites;
    });
  };

  // Swap animations between two sprites
  const swapAnimations = (spriteId1, spriteId2) => {
    setSprites(prevSprites => {
      const sprite1Index = prevSprites.findIndex(s => s.id === spriteId1);
      const sprite2Index = prevSprites.findIndex(s => s.id === spriteId2);

      if (sprite1Index === -1 || sprite2Index === -1) return prevSprites;

      const updatedSprites = [...prevSprites];
      const sprite1 = updatedSprites[sprite1Index];
      const sprite2 = updatedSprites[sprite2Index];

      const animations1 = sprite1.animations;
      const animations2 = sprite2.animations;

      updatedSprites[sprite1Index] = {
        ...sprite1,
        animations: animations2,
        currentAnimationIndex: 0,
        repeatCounters: {},
        saying: '',
        thinking: '',
        sayingTimer: sprite1.sayingTimer ? clearTimeout(sprite1.sayingTimer) : null,
        thinkingTimer: sprite1.thinkingTimer ? clearTimeout(sprite1.thinkingTimer) : null,
      };
      updatedSprites[sprite2Index] = {
        ...sprite2,
        animations: animations1,
        currentAnimationIndex: 0,
        repeatCounters: {},
        saying: '',
        thinking: '',
        sayingTimer: sprite2.sayingTimer ? clearTimeout(sprite2.sayingTimer) : null,
        thinkingTimer: sprite2.thinkingTimer ? clearTimeout(sprite2.thinkingTimer) : null,
      };

      return updatedSprites;
    });
  };
 
   const value = {
    sprites,
    activeSprite,
    setActiveSprite,
    addSprite,
    deleteSprite,
    addAnimation,
    updateAnimation,
    removeAnimation,
    ANIMATION_TYPES,
    playAnimations,
    stopAnimations,
    isPlaying,
    executeSingleAnimation, // Expose single execution
    updateSpritePosition,
    updateSpriteDirection,
    updateSpriteName,
    swapAnimations, // Expose swap function
  };

  return <SpriteContext.Provider value={value}>{children}</SpriteContext.Provider>;
};