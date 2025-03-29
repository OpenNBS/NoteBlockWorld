'use client';

import { SongViewDtoType } from '@shared/validation/song/dto/types';
import { useEffect, useRef } from 'react';

import axios from '@web/src/lib/axios';

export const SongCanvas = ({ song }: { song: SongViewDtoType }) => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const wasmModuleRef = useRef<any>(null);

  useEffect(() => {
    if (!canvasContainerRef.current) return;

    const element = canvasContainerRef.current;
    const canvas = element.querySelector('canvas');

    if (!canvas) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') event.preventDefault();
    };

    window.addEventListener('keydown', handleKeyDown);

    // Calculate window dimensions
    let fullscreen_window_width = window.screen.width;
    let fullscreen_window_height = window.screen.height;

    if (fullscreen_window_width < fullscreen_window_height) {
      [fullscreen_window_width, fullscreen_window_height] = [
        fullscreen_window_height,
        fullscreen_window_width,
      ];
    }

    // 720p resolution
    //const window_width = 1280;
    //const window_height = 720;

    const argumentsData = {
      font_id: 1, // Math.floor(Math.random() * 6),
      window_width: Number((fullscreen_window_width / 2).toFixed(0)),
      window_height: Number((fullscreen_window_height / 2).toFixed(0)),
      theme: {
        background_color: '#18181B', // Grass-like green
        accent_color: '#002FA3', // Orange (like Minecraft's iconic dirt/wood)
        text_color: '#F0F0F0', // Light gray
        white_key_color: '#F0F0F0', // Beige (like sand)
        black_key_color: '#1A1A1A', // Dark brown (like wood)
        white_text_key_color: '#1A1A1A', // Dark gray
        black_text_key_color: '#F0F0F0', // Light gray
      },
    };

    const scriptTag = document.createElement('script');

    scriptTag.src = '/nbs-player-rs.js';

    scriptTag.async = true; // Load the script asynchronously

    //scriptTag.onload = () => {
    //if (!window.Module) return;

    wasmModuleRef.current = window.Module; // Store for cleanup

    window.Module = {
      canvas: canvas,
      arguments: [JSON.stringify(argumentsData)],
      noInitialRun: true,
      preInit: async function () {
        // wait 2 seconds before starting
        await new Promise((resolve) => setTimeout(resolve, 200));

        const response_url = await axios.get(`/song/${song.publicId}/open`, {
          headers: {
            src: 'downloadButton',
          },
        });

        const song_url = response_url.data;
        console.log('Song URL:', song_url);

        const response = await fetch(song_url);
        const arrayBuffer = await response.arrayBuffer();
        const byteArray = new Uint8Array(arrayBuffer);

        if (window.FS) {
          window.FS.writeFile('/song.nbsx', byteArray);
        } else {
          console.error('FS is not defined');
        }

        if (window.callMain) {
          window.callMain([JSON.stringify(argumentsData)]);
        } else {
          console.error('callMain is not defined');
        }
      },
    };
    //};

    // Append the script tag to the body
    element.appendChild(scriptTag);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);

      if (canvas) {
        canvas.removeEventListener('keydown', () => undefined);
      }

      // Remove script tag
      const script = element.querySelector('script[src="/nbs-player-rs.js"]');
      if (script) script.remove();

      // Properly destroy WASM module
      if (wasmModuleRef.current) {
        if (wasmModuleRef.current.destroy) {
          wasmModuleRef.current.destroy();
        }

        wasmModuleRef.current = null;
      }

      // Clear global Module reference
      if (window.Module) {
        delete window.Module;
      }

      if (window.wasmInstance) {
        window.wasmInstance.delete();
      }

      // Force garbage collection
      if (window.gc) window.gc();
    };
  }, [song.publicId]);

  return (
    <div
      ref={canvasContainerRef}
      id='song-renderer-container'
      className='bg-zinc-800 aspect-[5/3] rounded-xl'
    >
      <canvas
        id='song-renderer'
        width={1280}
        height={720}
        className='w-full h-full rounded-xl'
        style={{
          // no filter
          filter: 'none',
          imageRendering: 'pixelated',
        }}
      />
    </div>
  );
};
