'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  description?: string;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function VideoPlayer({ src, poster, title, description }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const hideControlsTimer = useRef<NodeJS.Timeout | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Auto-hide controls after inactivity
  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    if (isPlaying) {
      hideControlsTimer.current = setTimeout(() => setShowControls(false), 3000);
    }
  }, [isPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onDurationChange = () => setDuration(video.duration);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => { setIsPlaying(false); setShowControls(true); };
    const onWaiting = () => setIsBuffering(true);
    const onCanPlay = () => setIsBuffering(false);
    const onEnded = () => { setIsPlaying(false); setShowControls(true); };

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('durationchange', onDurationChange);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('waiting', onWaiting);
    video.addEventListener('canplay', onCanPlay);
    video.addEventListener('ended', onEnded);

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('durationchange', onDurationChange);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('waiting', onWaiting);
      video.removeEventListener('canplay', onCanPlay);
      video.removeEventListener('ended', onEnded);
    };
  }, []);

  // Fullscreen change detection
  useEffect(() => {
    const onFSChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFSChange);
    return () => document.removeEventListener('fullscreenchange', onFSChange);
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setHasStarted(true);
      resetHideTimer();
    } else {
      video.pause();
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    const bar = progressRef.current;
    if (!video || !bar) return;
    const rect = bar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * video.duration;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const val = parseFloat(e.target.value);
    video.volume = val;
    setVolume(val);
    setIsMuted(val === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      container.requestFullscreen();
    }
  };

  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(video.currentTime + seconds, video.duration));
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className="relative bg-black rounded-2xl overflow-hidden shadow-2xl group"
      onMouseMove={resetHideTimer}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video Element */}
      <div className="relative aspect-video cursor-pointer" onClick={togglePlay}>
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          className="w-full h-full object-contain"
          preload="metadata"
          playsInline
        />

        {/* Big Play Button Overlay (shown before video starts) */}
        {!hasStarted && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="w-20 h-20 rounded-full bg-red-600/90 hover:bg-red-600 flex items-center justify-center shadow-2xl transition-all hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-10 h-10 text-white fill-current ml-1">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}

        {/* Buffering Spinner */}
        {isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}

        {/* Play/Pause indicator animation */}
        {hasStarted && !isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 text-white fill-current ml-0.5">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-12 pb-3 px-4 transition-opacity duration-300 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Progress Bar */}
        <div
          ref={progressRef}
          className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer mb-3 group/bar hover:h-2.5 transition-all"
          onClick={handleProgressClick}
        >
          <div
            className="h-full bg-red-600 rounded-full relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-red-600 rounded-full opacity-0 group-hover/bar:opacity-100 transition-opacity shadow-md" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Play/Pause */}
            <button onClick={togglePlay} className="text-white hover:text-red-400 transition-colors">
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Skip Back 10s */}
            <button onClick={() => skip(-10)} className="text-white hover:text-red-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M12.5 3C7.81 3 4.01 6.64 3.75 11.26L1 11.26.99 11.5C.99 11.5 1 11.5 1 11.5c0 5.52 4.48 10 10 10s10-4.48 10-10S17.52 1.5 12 1.5l.5 1.5zM11 7h2v6h-2V7zm-4.99 4.26c.13-3.1 2.2-5.56 5-6.14v1.01c-2.28.55-3.94 2.53-4.08 5.13H6.01zm8.99-6.14v1.01c2.8.58 4.87 3.04 5 6.13h.92c-.14-3.1-2.2-5.56-5-6.14zM13 13h2v6h-2z" />
              </svg>
            </button>

            {/* Skip Forward 10s */}
            <button onClick={() => skip(10)} className="text-white hover:text-red-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M12.5 3C7.81 3 4.01 6.64 3.75 11.26L1 11.26.99 11.5C.99 11.5 1 11.5 1 11.5c0 5.52 4.48 10 10 10s10-4.48 10-10S17.52 1.5 12 1.5l.5 1.5zM11 7h2v6h-2V7zm-4.99 4.26c.13-3.1 2.2-5.56 5-6.14v1.01c-2.28.55-3.94 2.53-4.08 5.13H6.01zm8.99-6.14v1.01c2.8.58 4.87 3.04 5 6.13h.92c-.14-3.1-2.2-5.56-5-6.14zM13 13h2v6h-2z" />
              </svg>
            </button>

            {/* Volume */}
            <div className="flex items-center gap-1.5 group/vol">
              <button onClick={toggleMute} className="text-white hover:text-red-400 transition-colors">
                {isMuted || volume === 0 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                  </svg>
                ) : volume < 0.5 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                    <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-0 group-hover/vol:w-20 transition-all duration-200 accent-red-600 cursor-pointer opacity-0 group-hover/vol:opacity-100"
              />
            </div>

            {/* Time */}
            <span className="text-white/80 text-xs font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Fullscreen */}
            <button onClick={toggleFullscreen} className="text-white hover:text-red-400 transition-colors">
              {isFullscreen ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Title & Description overlay (shown at start) */}
      {(title || description) && !hasStarted && (
        <div className="absolute top-0 left-0 right-0 p-5 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
          {title && <h3 className="text-white font-bold text-lg">{title}</h3>}
          {description && <p className="text-white/70 text-sm mt-1">{description}</p>}
        </div>
      )}
    </div>
  );
}
