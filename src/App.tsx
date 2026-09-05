import React, { useState, useEffect } from 'react';
import {
  Mic,
  FileAudio,
  Sparkles,
  Download,
  Volume2,
  FileText,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Headphones,
  BookOpen,
} from 'lucide-react';
import { TranscriptionData } from './types';
import { SAMPLE_CONVERSATIONS, generateSyntheticAudioBlob } from './data/sampleAudios';
import { AudioUploader } from './components/AudioUploader';
import { TranscriptViewer } from './components/TranscriptViewer';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { ExportModal } from './components/ExportModal';

export default function App() {
  // Current transcription data
  const [transcriptionData, setTranscriptionData] = useState<TranscriptionData | null>(null);

  // Active audio URL & info for audio player
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioName, setAudioName] = useState<string>('');

  // Seeking target for audio player
  const [seekSeconds, setSeekSeconds] = useState<number | null>(null);

  // Loading & error states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Export Modal state
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // Load initial sample so the app is immediately full and interactive!
  useEffect(() => {
    // Check if there is saved transcription in localStorage
    const saved = localStorage.getItem('lao_transcription_active');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTranscriptionData(parsed);
        setAudioName(parsed.fileName || 'ໄຟລ໌ສຽງ');
        const synthBlob = generateSyntheticAudioBlob(15);
        const synthUrl = URL.createObjectURL(synthBlob);
        setAudioUrl(synthUrl);
        return;
      } catch (e) {
        console.warn('Failed to parse saved transcription');
      }
    }

    // Default to the first high-quality sample
    const defaultSample = SAMPLE_CONVERSATIONS[0];
    setTranscriptionData(defaultSample.data);
    setAudioName(defaultSample.data.fileName || defaultSample.titleLao);
    const synthBlob = generateSyntheticAudioBlob(20);
    const synthUrl = URL.createObjectURL(synthBlob);
    setAudioUrl(synthUrl);
  }, []);

  // Save changes to localStorage
  const handleUpdateData = (newData: TranscriptionData) => {
    setTranscriptionData(newData);
    localStorage.setItem('lao_transcription_active', JSON.stringify(newData));
  };

  // Convert File/Blob to Base64
  const fileToBase64 = (fileOrBlob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const res = reader.result as string;
        resolve(res);
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(fileOrBlob);
    });
  };

  // Trigger transcription via server endpoint
  const handleTranscribe = async (
    fileOrBlob: File | Blob,
    filename: string,
    mimeType: string,
    options: any
  ) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Set audio preview
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      const newAudioUrl = URL.createObjectURL(fileOrBlob);
      setAudioUrl(newAudioUrl);
      setAudioName(filename);

      // Convert to base64
      const base64Data = await fileToBase64(fileOrBlob);

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audioBase64: base64Data,
          mimeType,
          options,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Server responded with status ${response.status}`);
      }

      const resData = await response.json();
      if (resData.success && resData.data) {
        const enriched: TranscriptionData = {
          ...resData.data,
          fileName: filename,
          durationFormatted: 'ສຳເລັດການຖອດສຽງ',
        };
        setTranscriptionData(enriched);
        localStorage.setItem('lao_transcription_active', JSON.stringify(enriched));
      } else {
        throw new Error('ບໍ່ສາມາດຖອດຂໍ້ຄວາມສຽງໄດ້ (No transcription data returned)');
      }
    } catch (err: any) {
      console.error('Transcription error:', err);
      setErrorMessage(err.message || 'ເກີດຂໍ້ຜິດພາດໃນການເຊື່ອມຕໍ່ກັບ Gemini AI');
    } finally {
      setIsLoading(false);
    }
  };

  // Load a sample directly
  const handleLoadSample = (sampleData: TranscriptionData, audioBlob: Blob) => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    const url = URL.createObjectURL(audioBlob);
    setAudioUrl(url);
    setAudioName(sampleData.fileName || sampleData.title);
    setTranscriptionData(sampleData);
    setErrorMessage(null);
    localStorage.setItem('lao_transcription_active', JSON.stringify(sampleData));
  };

  const handleSeek = (seconds: number) => {
    setSeekSeconds(seconds);
    // reset after a moment
    setTimeout(() => setSeekSeconds(null), 300);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e0e0e0] pb-28">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#0f0f0f]/95 backdrop-blur-md border-b border-[#222]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-sm shadow-indigo-900/40">
              L
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg text-white tracking-tight">
                  ລະບົບຖອດສຽງພາສາລາວ <span className="text-indigo-400 font-semibold text-sm">LaoScribe</span>
                </span>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-green-900/30 text-green-400 border border-green-800/50 text-[10px] font-medium">
                  gemini-3.5-transcribe
                </span>
              </div>
              <p className="text-[11px] text-gray-400 leading-none mt-0.5">
                ແຍກຜູ້ເວົ້າຊັດເຈນ • ສົ່ງອອກ Microsoft Word (.docx) & Google Docs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {transcriptionData && (
              <button
                id="btn-header-export"
                type="button"
                onClick={() => setIsExportModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow-sm transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ດາວໂຫຼດ Word / Docs</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Error Alert */}
        {errorMessage && (
          <div className="bg-rose-950/40 border border-rose-900/60 rounded-xl p-4 flex items-start gap-3 text-rose-300">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-bold text-rose-300">ເກີດຂໍ້ຜິດພາດ</h4>
              <p className="text-xs text-rose-400/90 mt-0.5">{errorMessage}</p>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-xs text-rose-400 hover:text-rose-200 font-semibold"
            >
              ປິດ
            </button>
          </div>
        )}

        {/* Audio Uploader Card */}
        <AudioUploader
          onTranscribe={handleTranscribe}
          onLoadSample={handleLoadSample}
          isLoading={isLoading}
          activeAudioName={audioName}
        />

        {/* Loading overlay indicator when actively transcribing */}
        {isLoading && (
          <div className="bg-[#121212] rounded-xl shadow-lg border border-[#222] p-8 text-center space-y-4 animate-in fade-in">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-indigo-950/60 border border-indigo-900/40 text-indigo-400">
              <Sparkles className="w-7 h-7 animate-spin" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                ກຳລັງປະມວນຜົນສຽງ ແລະ ແຍກຜູ້ເວົ້າດ້ວຍ Gemini AI...
              </h3>
              <p className="text-xs text-gray-400 max-w-md mx-auto mt-1">
                ລະບົບກຳລັງວິເຄາະສຽງ, ຈຳແນກສຽງຜູ້ເວົ້າແຕ່ລະຄົນ, ແລະ ແປງຂໍ້ຄວາມເປັນພາສາລາວທີ່ຖືກຕ້ອງຕາມຫຼັກໄວຍາກອນ
              </p>
            </div>
            <div className="max-w-xs mx-auto h-1.5 bg-[#222] rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 rounded-full animate-pulse w-3/4" />
            </div>
          </div>
        )}

        {/* Transcript Viewer */}
        {transcriptionData && (
          <TranscriptViewer
            data={transcriptionData}
            onUpdateData={handleUpdateData}
            onOpenExportModal={() => setIsExportModalOpen(true)}
            onSeekAudio={handleSeek}
          />
        )}
      </main>

      {/* Sticky Audio Player Bar */}
      <AudioPlayerBar
        audioUrl={audioUrl}
        audioName={audioName}
        seekToTime={seekSeconds}
      />

      {/* Export & Download Modal */}
      {transcriptionData && (
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          data={transcriptionData}
        />
      )}
    </div>
  );
}
