import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Gauge,
  Music,
} from 'lucide-react';

interface AudioPlayerBarProps {
  audioUrl?: string | null;
  audioName?: string;
  onTimeUpdate?: (currentTime: number) => void;
  seekToTime?: number | null;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  audioUrl,
  audioName,
  onTimeUpdate,
  seekToTime,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // Handle external seek request
  useEffect(() => {
    if (seekToTime !== null && seekToTime !== undefined && audioRef.current) {
      audioRef.current.currentTime = seekToTime;
      if (!isPlaying) {
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  }, [seekToTime]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch((err) => {
        console.warn('Audio playback error', err);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const cur = audioRef.current.currentTime;
    setCurrentTime(cur);
    if (onTimeUpdate) onTimeUpdate(cur);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration || 0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const handleRateChange = () => {
    const rates = [1, 1.25, 1.5, 2, 0.75];
    const nextRateIndex = (rates.indexOf(playbackRate) + 1) % rates.length;
    const nextRate = rates[nextRateIndex];
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!audioUrl) return null;

  return (
    <div
      id="audio-player-bar"
      className="sticky bottom-4 z-30 mx-auto max-w-4xl px-4"
    >
      <div className="bg-[#0f0f0f]/95 backdrop-blur-md text-[#e0e0e0] rounded-xl p-4 shadow-2xl border border-[#222] flex flex-col sm:flex-row items-center gap-4 transition-all">
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />

        {/* Info & Play button */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            id="btn-player-toggle"
            type="button"
            onClick={togglePlay}
            className="w-10 h-10 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-sm shadow-indigo-950/60 active:scale-95 transition-all cursor-pointer shrink-0"
            title={isPlaying ? 'ພັກໄວ້' : 'ຫຼິ້ນສຽງ'}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
          </button>

          <div className="min-w-0 pr-2">
            <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-medium">
              <Music className="w-3.5 h-3.5" />
              <span>ກຳລັງຫຼິ້ນສຽງບັນທຶກ</span>
            </div>
            <div className="text-sm font-semibold text-white truncate max-w-[200px] sm:max-w-[180px]">
              {audioName || 'ໄຟລ໌ສຽງ'}
            </div>
          </div>
        </div>

        {/* Progress Timeline */}
        <div className="flex-1 w-full flex items-center gap-2.5">
          <span className="text-xs font-mono text-indigo-400 w-11 text-right shrink-0">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-[#222] rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none"
          />
          <span className="text-xs font-mono text-gray-500 w-11 shrink-0">
            {formatTime(duration)}
          </span>
        </div>

        {/* Controls: Speed & Mute */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleRateChange}
            className="px-2.5 py-1 rounded-md bg-[#1a1a1a] hover:bg-[#252525] border border-[#333] text-gray-300 text-xs font-mono font-medium flex items-center gap-1 transition-colors"
            title="ຄວາມໄວໃນການຫຼິ້ນ"
          >
            <Gauge className="w-3 h-3 text-indigo-400" />
            <span>{playbackRate}x</span>
          </button>

          <button
            type="button"
            onClick={toggleMute}
            className="p-1.5 rounded-md hover:bg-[#1f1f1f] text-gray-400 hover:text-white transition-colors"
            title={isMuted ? 'ເປີດສຽງ' : 'ປິດສຽງ'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
