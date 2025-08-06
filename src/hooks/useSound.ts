// @ts-ignore
import { useEffect, useRef } from 'react';
// @ts-ignore
import { Howl } from 'howler';
import { SoundEffects } from '../types';

export const useSound = () => {
  const soundsRef = useRef<SoundEffects | null>(null);

  useEffect(() => {
    // Initialize sounds
    soundsRef.current = {
      click: new Howl({
        src: ['/sounds/click.mp3'],
        volume: 0.5,
        preload: true,
      }),
      cheer: new Howl({
        src: ['/sounds/cheer.mp3'],
        volume: 0.7,
        preload: true,
      }),
      meow: new Howl({
        src: ['/sounds/meow.mp3'],
        volume: 0.6,
        preload: true,
      }),
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
    if (soundsRef.current?.click) {
      (soundsRef.current.click as any).play();
    }
  };

  const playCheer = () => {
    if (soundsRef.current?.cheer) {
      (soundsRef.current.cheer as any).play();
    }
  };

  const playMeow = () => {
    if (soundsRef.current?.meow) {
      (soundsRef.current.meow as any).play();
    }
  };

  return {
    playClick,
    playCheer,
    playMeow,
  };
}; 