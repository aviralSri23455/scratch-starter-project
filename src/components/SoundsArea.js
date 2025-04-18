import React, { useRef, useState, useEffect } from 'react'; // Import useState, useEffect
import Icon from './Icon'; // Import Icon for toolbar buttons

const SoundsArea = () => {
  const audioRef = useRef(null);
  const [audioContext, setAudioContext] = useState(null);
  const [audioSource, setAudioSource] = useState(null);
  const [gainNode, setGainNode] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);

  // Initialize AudioContext
  useEffect(() => {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const gain = context.createGain();
    gain.connect(context.destination);
    setAudioContext(context);
    setGainNode(gain);

    return () => {
      context.close();
    };
  }, []);

  // Load audio source when audioRef is ready and context exists
  useEffect(() => {
    if (audioRef.current && audioContext && gainNode && !audioSource) {
      const source = audioContext.createMediaElementSource(audioRef.current);
      source.connect(gainNode);
      setAudioSource(source);

      audioRef.current.onplay = () => setIsPlaying(true);
      audioRef.current.onpause = () => setIsPlaying(false);
      audioRef.current.onended = () => {
        setIsPlaying(false);
        audioRef.current.currentTime = 0; // Reset on end
      };
    }
    // Cleanup source node on component unmount or context change
    return () => {
      audioSource?.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioRef, audioContext, gainNode]); // Rerun if these change

  // Update audio element properties when state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  useEffect(() => {
    if (gainNode) {
      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    }
  }, [volume, gainNode, audioContext]);

  const playSound = () => {
    if (!audioContext || !audioRef.current) return;

    // Resume context if suspended
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.currentTime = 0; // Start from beginning
      audioRef.current.play().catch(error => console.error("Audio play failed:", error));
    }
  };

  const changeRate = (delta) => {
    setPlaybackRate(prev => Math.max(0.1, Math.min(4, prev + delta))); // Clamp between 0.1x and 4x
  };

  const changeVolume = (delta) => {
    setVolume(prev => Math.max(0, Math.min(1, prev + delta))); // Clamp between 0 and 1
  };

  const toggleMute = () => {
    setVolume(prev => (prev > 0 ? 0 : 1));
  };

  // Assuming meow.mp3 is in the public folder
  const soundFilePath = '/meow.mp3';
  const sounds = [{ id: 1, name: 'Meow', duration: 0.85 }]; // Placeholder sound data
  const selectedSound = sounds[0]; // Assume first sound is selected

  // --- UI Adjustments Start ---
  return (
    <div className="flex flex-1 h-full overflow-hidden bg-gray-100">
      {/* Left Panel: Sound List (Keep as is for now) */}
      <div className="w-24 flex-none h-full overflow-y-auto p-2 border-r border-gray-300 bg-white">
        {sounds.map((sound, index) => (
          <div
            key={sound.id}
            className={`p-1 mb-2 border rounded cursor-pointer ${selectedSound.id === sound.id ? 'border-blue-500 bg-blue-100' : 'border-gray-300 hover:bg-gray-50'}`}
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span>{index + 1}</span>
              <button className="text-gray-400 hover:text-red-500">x</button>
            </div>
            <div className="w-16 h-16 mx-auto flex items-center justify-center bg-purple-200 rounded">
              <Icon name="volume-full" size={32} className="text-purple-600" />
            </div>
            <div className="text-center text-xs mt-1">{sound.name}</div>
            <div className="text-center text-xs text-gray-500">{sound.duration}s</div>
          </div>
        ))}
        <button className="w-full mt-2 p-2 text-center text-xs bg-blue-500 text-white rounded hover:bg-blue-600">Add Sound</button>
      </div>

      {/* Right Panel: Editing Area - Adjusted Layout */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white p-4 items-center">
        {/* Top Info Bar */} 
        <div className="flex items-center justify-between w-full mb-4">
          <div className="flex items-center">
            <span className="text-sm font-semibold mr-2">Sound: {selectedSound.name}</span>
            {/* <span className="text-xs text-gray-500">({selectedSound.duration} seconds)</span> */}
          </div>
          <div className="flex space-x-1">
            <button className="p-1 hover:bg-gray-200 rounded"><Icon name="edit-copy" size={16} /></button>
            <button className="p-1 hover:bg-gray-200 rounded"><Icon name="edit-paste" size={16} /></button>
            <button className="p-1 hover:bg-gray-200 rounded"><Icon name="copy-to-new" size={16} /></button> {/* Placeholder */}
            <button className="p-1 hover:bg-gray-200 rounded"><Icon name="edit-delete" size={16} /></button>
          </div>
        </div>

        {/* Waveform Placeholder - Centered */} 
        <div className="w-full flex-grow flex items-center justify-center mb-4">
          <div className="w-11/12 h-32 bg-purple-200 rounded flex items-center justify-center">
            <span className="text-purple-600 italic">Sound Waveform Placeholder</span>
          </div>
        </div>

        {/* Playback Controls - Centered below waveform */} 
        <div className="flex flex-col items-center space-y-2 mb-4">
          <button onClick={playSound} className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white">
            <Icon name={isPlaying ? 'stop' : 'play'} size={24} />
          </button>
          <div className="flex items-center space-x-2">
            {/* Effect buttons with handlers */}
            <button onClick={() => changeRate(0.25)} className="text-xs p-1 hover:bg-gray-200 rounded">Faster</button>
            <button onClick={() => changeRate(-0.25)} className="text-xs p-1 hover:bg-gray-200 rounded">Slower</button>
            <button onClick={() => changeVolume(0.2)} className="text-xs p-1 hover:bg-gray-200 rounded">Louder</button>
            <button onClick={() => changeVolume(-0.2)} className="text-xs p-1 hover:bg-gray-200 rounded">Softer</button>
            <button onClick={toggleMute} className={`text-xs p-1 hover:bg-gray-200 rounded ${volume === 0 ? 'bg-gray-300' : ''}`}>Mute</button>
            {/* Placeholder effect buttons - No functionality yet */}
            <button className="text-xs p-1 hover:bg-gray-200 rounded opacity-50 cursor-not-allowed">Fade in</button>
            <button className="text-xs p-1 hover:bg-gray-200 rounded opacity-50 cursor-not-allowed">Fade out</button>
            <button className="text-xs p-1 hover:bg-gray-200 rounded opacity-50 cursor-not-allowed">Reverse</button>
            <button className="text-xs p-1 hover:bg-gray-200 rounded opacity-50 cursor-not-allowed">Robot</button>
          </div>
        </div>

        {/* Hidden audio element for playback */}
        {/* Added crossOrigin="anonymous" for potential future waveform analysis */}
        <audio ref={audioRef} src={soundFilePath} preload="auto" crossOrigin="anonymous"></audio>
      </div>
    </div>
  );
  // --- UI Adjustments End ---
};

export default SoundsArea;