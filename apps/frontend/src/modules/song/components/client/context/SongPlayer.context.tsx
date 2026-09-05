'use client';

import { PianoRollView, Player, Viewer } from '@opennbs/nbsvis';
import { usePathname } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import type { SongPreviewDtoType, SongViewDtoType } from '@nbw/database';

import { getSongOpenUrl } from '../../../util/downloadSong';

const RENDER_WIDTH = 1280;
const RENDER_HEIGHT = 768;

export type PlayingSong = Pick<
  SongViewDtoType,
  'publicId' | 'title' | 'originalAuthor'
> & {
  uploader: Pick<SongViewDtoType['uploader'], 'username'>;
  stats: Pick<SongViewDtoType['stats'], 'duration'>;
};

export type LoadSongOptions = {
  autoPlay?: boolean;
};

const toPlayingSong = (song: PlayingSong): PlayingSong => ({
  publicId: song.publicId,
  title: song.title,
  originalAuthor: song.originalAuthor,
  uploader: { username: song.uploader.username },
  stats: { duration: song.stats.duration },
});

export const previewToPlayingSong = (
  song: SongPreviewDtoType,
): PlayingSong => ({
  publicId: song.publicId,
  title: song.title,
  originalAuthor: song.originalAuthor,
  uploader: { username: song.uploader.username },
  stats: { duration: song.duration },
});

type SongPlayerContextType = {
  registerPageMount: (node: HTMLDivElement | null) => void;
  registerDockMount: (node: HTMLDivElement | null) => void;
  loadSong: (song: PlayingSong, options?: LoadSongOptions) => Promise<void>;
  playSong: (song: PlayingSong) => Promise<void>;
  play: () => void;
  pause: () => void;
  togglePlayback: () => boolean;
  isLoading: boolean;
  loadingPhase: string;
  error: string | null;
  currentSong: PlayingSong | null;
  isPlaying: boolean;
  isSongRoute: boolean;
};

const SongPlayerContext = createContext<SongPlayerContextType | null>(null);

export const SongPlayerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const pageMountRef = useRef<HTMLDivElement | null>(null);
  const dockMountRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const playerRef = useRef<Player | null>(null);
  const loadedSongPublicIdRef = useRef<string | null>(null);
  const loadingSongPublicIdRef = useRef<string | null>(null);
  const currentSongPublicIdRef = useRef<string | null>(null);
  const isCancelledRef = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState('Preparing player...');
  const [error, setError] = useState<string | null>(null);
  const [currentSong, setCurrentSong] = useState<PlayingSong | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef(false);

  const isSongRoute = useMemo(() => {
    if (!pathname || !currentSong) return false;

    return pathname === `/song/${currentSong.publicId}`;
  }, [currentSong, pathname]);

  const attachViewerToMount = useCallback((mountNode: HTMLDivElement) => {
    const viewer = viewerRef.current;

    if (!viewer) return;

    viewer.setResponsive(false);
    mountNode.appendChild(viewer.app.canvas);
    viewer.container = mountNode;
    viewer.setResponsive(true);
    viewer.resize(RENDER_WIDTH, RENDER_HEIGHT);
  }, []);

  const getPreferredMount = useCallback(
    (songPublicId?: string | null) => {
      const id = songPublicId ?? currentSongPublicIdRef.current;
      const onPlayingSongPage = !!id && pathname === `/song/${id}`;

      if (onPlayingSongPage) {
        return pageMountRef.current ?? dockMountRef.current;
      }

      return dockMountRef.current ?? pageMountRef.current;
    },
    [pathname],
  );

  const syncViewerMount = useCallback(() => {
    const viewer = viewerRef.current;
    const targetMount = getPreferredMount();

    if (!viewer || !targetMount) return;
    if (viewer.container === targetMount) return;

    attachViewerToMount(targetMount);
  }, [attachViewerToMount, getPreferredMount]);

  const registerPageMount = useCallback(
    (node: HTMLDivElement | null) => {
      pageMountRef.current = node;
      syncViewerMount();
    },
    [syncViewerMount],
  );

  const registerDockMount = useCallback(
    (node: HTMLDivElement | null) => {
      dockMountRef.current = node;
      syncViewerMount();
    },
    [syncViewerMount],
  );

  const setActiveSong = useCallback((song: PlayingSong) => {
    currentSongPublicIdRef.current = song.publicId;
    setCurrentSong(toPlayingSong(song));
  }, []);

  const setPlayingState = useCallback((playing: boolean) => {
    isPlayingRef.current = playing;
    setIsPlaying(playing);
  }, []);

  const play = useCallback(() => {
    playerRef.current?.play();
    setPlayingState(true);
  }, [setPlayingState]);

  const pause = useCallback(() => {
    playerRef.current?.pause();
    setPlayingState(false);
  }, [setPlayingState]);

  const togglePlayback = useCallback(() => {
    // nbsvis togglePlayback() reads a worklet flag that stays false until
    // async audioEngine.play() finishes, so the first click after autoPlay
    // would call play() again and invert React state. Toggle from our own flag.
    if (isPlayingRef.current) {
      pause();
      return false;
    }

    play();
    return true;
  }, [pause, play]);

  const loadSong = useCallback(
    async (song: PlayingSong, options?: LoadSongOptions) => {
      const publicId = song.publicId;
      const autoPlay = options?.autoPlay ?? false;

      if (
        loadingSongPublicIdRef.current === publicId ||
        (loadedSongPublicIdRef.current === publicId && !!playerRef.current)
      ) {
        setActiveSong(song);
        syncViewerMount();
        return;
      }

      let didLoad = false;

      try {
        loadingSongPublicIdRef.current = publicId;
        setIsLoading(true);
        setError(null);
        setPlayingState(false);
        setActiveSong(song);
        setLoadingPhase('Preparing player...');

        const mountNode = getPreferredMount(publicId);
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
          player.on('ended', () => setPlayingState(false));
          player.on('stop', () => setPlayingState(false));
        } else {
          syncViewerMount();
        }

        if (!playerRef.current) {
          throw new Error('Player initialization failed');
        }

        // Stop current song (TODO: unload)
        try {
          playerRef.current.stop();
        } catch {
          // Ignore stop errors (e.g. if no song loaded)
        }

        setLoadingPhase('Loading song data...');

        const songUrl = await getSongOpenUrl({ publicId });
        await Promise.resolve(playerRef.current.loadSong(songUrl));
        loadedSongPublicIdRef.current = publicId;
        didLoad = true;
      } catch (err) {
        if (!isCancelledRef.current) {
          setError(err instanceof Error ? err.message : 'Failed to load song');
        }
      } finally {
        loadingSongPublicIdRef.current = null;
        if (!isCancelledRef.current) setIsLoading(false);

        try {
          if (didLoad && autoPlay) {
            playerRef.current?.play();
            if (!isCancelledRef.current) setPlayingState(true);
          } else {
            playerRef.current?.pause();
            if (!isCancelledRef.current) setPlayingState(false);
          }
        } catch {
          if (!isCancelledRef.current) setPlayingState(false);
        }
      }
    },
    [getPreferredMount, setActiveSong, setPlayingState, syncViewerMount],
  );

  const playSong = useCallback(
    async (song: PlayingSong) => {
      const publicId = song.publicId;

      if (loadingSongPublicIdRef.current === publicId) {
        setActiveSong(song);
        return;
      }

      if (loadedSongPublicIdRef.current === publicId && playerRef.current) {
        setActiveSong(song);
        syncViewerMount();
        togglePlayback();
        return;
      }

      await loadSong(song, { autoPlay: true });
    },
    [loadSong, setActiveSong, syncViewerMount, togglePlayback],
  );

  useEffect(() => {
    isCancelledRef.current = false;

    return () => {
      isCancelledRef.current = true;
    };
  }, []);

  useEffect(() => {
    syncViewerMount();
  }, [syncViewerMount]);

  const value = useMemo(
    () => ({
      registerPageMount,
      registerDockMount,
      loadSong,
      playSong,
      play,
      pause,
      togglePlayback,
      isLoading,
      loadingPhase,
      error,
      currentSong,
      isPlaying,
      isSongRoute,
    }),
    [
      currentSong,
      error,
      isLoading,
      isPlaying,
      isSongRoute,
      loadSong,
      loadingPhase,
      pause,
      play,
      playSong,
      registerDockMount,
      registerPageMount,
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
