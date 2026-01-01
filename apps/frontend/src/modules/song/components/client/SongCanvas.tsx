'use client';

import { useEffect, useRef } from 'react';

import { SongViewDtoType } from '@nbw/database';
import axios from '@web/lib/axios';

export const SongCanvas = ({ song }: { song: SongViewDtoType }) => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const wasmModuleRef = useRef<any>(null);
  let scriptTag: HTMLScriptElement | null = null;

  useEffect(() => {
    if (!canvasContainerRef.current) return;

    const element = canvasContainerRef.current;
    const canvas = element.querySelector('canvas');

    if (!canvas) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') event.preventDefault();
    };

    window.addEventListener('keydown', handleKeyDown);

    const fullscreen_window_width = window.screen.width;
    const fullscreen_window_height = window.screen.height;

    const argumentsData = {
      font_id: 1,
      window_width: Math.floor(fullscreen_window_width / 2),
      window_height: Math.floor(fullscreen_window_height / 2),
      theme: {
        background_color: '#18181B',
        accent_color: '#002FA3',
        text_color: '#F0F0F0',
        white_key_color: '#F0F0F0',
        black_key_color: '#1A1A1A',
        white_text_key_color: '#1A1A1A',
        black_text_key_color: '#F0F0F0',
      },
    };

    // Create and append script dynamically
    scriptTag = document.createElement('script');
    scriptTag.src = '/nbs-player-rs.js';
    scriptTag.async = true;

    window.Module = {
      canvas,
      arguments: [JSON.stringify(argumentsData)],
      noInitialRun: true,
      onAbort: () => console.log('WASM Module Aborted'),
      preInit: async function () {
        try {
          const response = await axios.get(`/song/${song.publicId}/open`, {
            headers: { src: 'downloadButton' },
          });

          const song_url = response.data;
          console.log('Song URL:', song_url);

          const responseData = await fetch(song_url);
          const byteArray = new Uint8Array(await responseData.arrayBuffer());

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
        } catch (error) {
          console.error('Error initializing WASM:', error);
        }
      },
    };

    element.appendChild(scriptTag);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);

      if (wasmModuleRef.current) {
        try {
          wasmModuleRef.current._free?.(); // Free memory if `_free()` is available
          wasmModuleRef.current.quit?.(); // Call `quit()` if it exists
          wasmModuleRef.current.destroy?.(); // Call `destroy()` if it exists
          wasmModuleRef.current = null;
        } catch (error) {
          console.error('Error cleaning up WASM:', error);
        }
      }

      if (window.Module) {
        delete window.Module;
      }

      if (window.wasmInstance) {
        window.wasmInstance.delete();
      }

      // Remove the script tag
      if (scriptTag && scriptTag.parentNode) {
        scriptTag.parentNode.removeChild(scriptTag);
      }

      // Force garbage collection if available
      if (window.gc) {
        window.gc();
      }
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
        style={{ filter: 'none', imageRendering: 'pixelated' }}
      />
    </div>
  );
};
