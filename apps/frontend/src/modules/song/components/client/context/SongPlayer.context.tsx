'use client';

import { PianoRollView, Player, Viewer } from '@opennbs/nbsvis';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { getSongOpenUrl } from '../../../util/downloadSong';

const RENDER_WIDTH = 1280;
const RENDER_HEIGHT = 768;

type SongPlayerContextType = {
  registerMount: (node: HTMLDivElement | null) => void;
  loadSong: (publicId: string) => Promise<void>;
  play: () => void;
  pause: () => void;
  togglePlayback: () => boolean;
  isLoading: boolean;
  loadingPhase: string;
  error: string | null;
};

const SongPlayerContext = createContext<SongPlayerContextType | null>(null);

export const SongPlayerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const playerRef = useRef<Player | null>(null);
  const isCancelledRef = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState('Preparing player...');
  const [error, setError] = useState<string | null>(null);

  const attachViewerToMount = useCallback((mountNode: HTMLDivElement) => {
    const viewer = viewerRef.current;

    if (!viewer) return;

    viewer.setResponsive(false);
    mountNode.appendChild(viewer.app.canvas);
    viewer.container = mountNode;
    viewer.setResponsive(true);
    viewer.resize(RENDER_WIDTH, RENDER_HEIGHT);
  }, []);

  const registerMount = useCallback(
    (node: HTMLDivElement | null) => {
      mountRef.current = node;

      if (node && viewerRef.current) {
        attachViewerToMount(node);
      }
    },
    [attachViewerToMount],
  );

  const loadSong = useCallback(
    async (publicId: string) => {
      try {
        setIsLoading(true);
        setError(null);
        setLoadingPhase('Preparing player...');

        const mountNode = mountRef.current;
        if (!mountNode) {
          throw new Error('Player container not ready');
        }

        if (!viewerRef.current || !playerRef.current) {
          setLoadingPhase('Initializing viewer...');
          const viewer = new Viewer(mountNode);

          await viewer.init();
          await viewer.setView(new PianoRollView());
          viewer.resize(RENDER_WIDTH, RENDER_HEIGHT);

          if (isCancelledRef.current) return;

          const player = new Player(viewer, {
            audioEngine: {
              urlBase: `${window.location.origin}/`,
            },
          });

          viewerRef.current = viewer;
          playerRef.current = player;
        } else if (viewerRef.current.container !== mountNode) {
          attachViewerToMount(mountNode);
        }

        if (!playerRef.current) {
          throw new Error('Player initialization failed');
        }

        setLoadingPhase('Loading song data...');

        const songUrl = await getSongOpenUrl({ publicId });
        await Promise.resolve(playerRef.current.loadSong(songUrl));
      } catch (err) {
        if (!isCancelledRef.current) {
          setError(err instanceof Error ? err.message : 'Failed to load song');
        }
      } finally {
        if (!isCancelledRef.current) setIsLoading(false);
      }
    },
    [attachViewerToMount],
  );

  const play = useCallback(() => {
    playerRef.current?.play();
  }, []);

  const pause = useCallback(() => {
    playerRef.current?.pause();
  }, []);

  const togglePlayback = useCallback(() => {
    return playerRef.current?.togglePlayback() ?? false;
  }, []);

  useEffect(() => {
    isCancelledRef.current = false;

    return () => {
      isCancelledRef.current = true;
    };
  }, []);

  const value = useMemo(
    () => ({
      registerMount,
      loadSong,
      play,
      pause,
      togglePlayback,
      isLoading,
      loadingPhase,
      error,
    }),
    [
      error,
      isLoading,
      loadSong,
      loadingPhase,
      pause,
      play,
      registerMount,
      togglePlayback,
    ],
  );

  return (
    <SongPlayerContext.Provider value={value}>
      {children}
    </SongPlayerContext.Provider>
  );
};

export const useSongPlayer = () => {
  const context = useContext(SongPlayerContext);

  if (!context) {
    throw new Error('useSongPlayer must be used within SongPlayerProvider');
  }

  return context;
};
