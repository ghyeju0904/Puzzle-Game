import { useEffect, useRef } from 'react';
import { SoundEffects } from '../types';

export const useSound = () => {
  const soundsRef = useRef<SoundEffects | null>(null);

  useEffect(() => {
    // Only create sounds if they exist (for now, we'll create empty sounds)
    soundsRef.current = {
      click: null, // Disabled for now
      cheer: null, // Disabled for now
      meow: null,  // Disabled for now
    };

    // Cleanup on unmount
    return () => {
      if (soundsRef.current) {
        Object.values(soundsRef.current).forEach((sound: any) => {
          if (sound && typeof sound.unload === 'function') {
            sound.unload();
          }
        });
      }
    };
  }, []);

  const playClick = () => {
    // Sound disabled for now
    console.log('Click sound (disabled)');
  };

  const playCheer = () => {
    // Sound disabled for now
    console.log('Cheer sound (disabled)');
  };

  const playMeow = () => {
    // Sound disabled for now
    console.log('Meow sound (disabled)');
  };

  return {
    playClick,
    playCheer,
    playMeow,
  };
}; 