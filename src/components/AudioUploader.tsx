import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  Mic,
  Square,
  FileAudio,
  Sparkles,
  Play,
  RotateCcw,
  Volume2,
  AlertCircle,
  Sliders,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { SAMPLE_CONVERSATIONS, generateSyntheticAudioBlob } from '../data/sampleAudios';
import { TranscriptionData } from '../types';

interface AudioUploaderProps {
  onTranscribe: (file: File | Blob, filename: string, mimeType: string, options: any) => Promise<void>;
  onLoadSample: (sample: TranscriptionData, audioBlob: Blob) => void;
  isLoading: boolean;
  activeAudioName?: string;
}

export const AudioUploader: React.FC<AudioUploaderProps> = ({
  onTranscribe,
  onLoadSample,
  isLoading,
  activeAudioName,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewAudioUrl, setPreviewAudioUrl] = useState<string | null>(null);

  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [recordBlob, setRecordBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  // Settings / Hints
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [modelChoice, setModelChoice] = useState<'gemini-3.5-transcribe' | 'gemini-3.1-flash-lite' | 'gemini-3.8-flash'>('gemini-3.5-transcribe');
  const [contextHint, setContextHint] = useState('');
  const [speakersHint, setSpeakersHint] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up blob url
  useEffect(() => {
    return () => {
      if (previewAudioUrl) {
        URL.revokeObjectURL(previewAudioUrl);
      }
    };
  }, [previewAudioUrl]);

  const handleFileChange = (file: File) => {
    if (!file) return;
    setSelectedFile(file);
    setRecordBlob(null);

    if (previewAudioUrl) URL.revokeObjectURL(previewAudioUrl);
    const url = URL.createObjectURL(file);
    setPreviewAudioUrl(url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('audio/') || file.name.match(/\.(mp3|wav|m4a|ogg|aac|webm|flac)$/i)) {
        handleFileChange(file);
      } else {
        alert('ກະລຸນາເລືອກໄຟລ໌ສຽງ ເຊັ່ນ: MP3, WAV, M4A, OGG, WebM');
      }
    }
  };

  // Start Mic Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setRecordBlob(audioBlob);
        setSelectedFile(null);

        if (previewAudioUrl) URL.revokeObjectURL(previewAudioUrl);
        const url = URL.createObjectURL(audioBlob);
        setPreviewAudioUrl(url);

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setRecordDuration(0);

      timerRef.current = setInterval(() => {
        setRecordDuration((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Mic access error:', err);
      alert('ບໍ່ສາມາດເຂົ້າເຖິງໄມໂຄຣໂຟນໄດ້ ກະລຸນາອະນຸຍາດການໃຊ້ງານໄມໂຄຣໂຟນ (Please allow microphone access)');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const cancelRecording = () => {
    stopRecording();
    setRecordBlob(null);
    if (previewAudioUrl) {
      URL.revokeObjectURL(previewAudioUrl);
      setPreviewAudioUrl(null);
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Trigger submission
  const handleSubmit = () => {
    const audioData = selectedFile || recordBlob;
    if (!audioData) return;

    const filename = selectedFile
      ? selectedFile.name
      : `ສຽງບັນທຶກ_${new Date().toISOString().slice(0, 10)}.webm`;
    const mimeType = selectedFile ? selectedFile.type || 'audio/mp3' : 'audio/webm';

    onTranscribe(audioData, filename, mimeType, {
      model: modelChoice,
      context: contextHint,
      speakersHint,
    });
  };

  const handleSelectSample = (sample: typeof SAMPLE_CONVERSATIONS[0]) => {
    const audioBlob = generateSyntheticAudioBlob(15);
    onLoadSample(sample.data, audioBlob);
  };

  return (
    <div id="audio-uploader-card" className="bg-[#0f0f0f] rounded-xl shadow-lg border border-[#222] p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#222]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/50 text-indigo-400 border border-indigo-900/40 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Speaker Diarization • ພາສາລາວ</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            ອັບໂຫຼດໄຟລ໌ສຽງ ຫຼື ບັນທຶກສຽງ
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            ຮອງຮັບໄຟລ໌ MP3, WAV, M4A, OGG, WebM ແຍກຜູ້ເວົ້າອັດຕະໂນມັດ ແລະ ຖອດເປັນພາສາລາວ
          </p>
        </div>

        {/* Quick Sample Button */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 hidden md:inline font-medium uppercase tracking-wider">ຕົວຢ່າງ:</span>
          <div className="flex gap-2 flex-wrap">
            {SAMPLE_CONVERSATIONS.map((sample, idx) => (
              <button
                key={sample.id}
                id={`btn-sample-${idx}`}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-[#1a1a1a] hover:bg-[#252525] text-gray-300 border border-[#333] transition-colors"
                title={sample.description}
              >
                <Play className="w-3 h-3 text-indigo-400" />
                <span>ຕົວຢ່າງ {idx + 1}: {sample.speakersCount} ຜູ້ເວົ້າ</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main input modes: Dropzone & Mic */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {/* Dropzone */}
        <div
          id="dropzone-area"
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-all duration-200 flex flex-col items-center justify-center ${
            dragOver
              ? 'border-indigo-500 bg-indigo-950/30 scale-[0.99]'
              : selectedFile
              ? 'border-emerald-700/60 bg-emerald-950/20'
              : 'border-[#333] hover:border-indigo-500/70 bg-[#141414] hover:bg-[#181818]'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileChange(e.target.files[0]);
              }
            }}
            accept="audio/*,.mp3,.wav,.m4a,.ogg,.aac,.webm,.flac"
            className="hidden"
          />

          <div className="w-13 h-13 rounded-xl bg-indigo-950/60 border border-indigo-900/40 text-indigo-400 flex items-center justify-center mb-3">
            <UploadCloud className="w-6 h-6" />
          </div>

          <h3 className="font-semibold text-gray-200 text-base mb-1">
            {selectedFile ? selectedFile.name : 'ຄລິກ ຫຼື ລາກວາງໄຟລ໌ສຽງທີ່ນີ້'}
          </h3>
          <p className="text-xs text-gray-400 mb-3">
            {selectedFile
              ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • ພ້ອມຖອດຂໍ້ຄວາມ`
              : 'MP3, WAV, M4A, WebM (ສູງສຸດ 50MB)'}
          </p>

          <span className="inline-block px-3 py-1 bg-[#1c1c1c] border border-[#333] rounded-md text-xs font-medium text-gray-300 hover:bg-[#252525]">
            {selectedFile ? 'ປ່ຽນໄຟລ໌ສຽງ' : 'ເລືອກໄຟລ໌ຈາກເຄື່ອງ'}
          </span>
        </div>

        {/* Microphone Recording Box */}
        <div
          id="mic-recording-card"
          className={`border rounded-xl p-6 sm:p-8 text-center flex flex-col items-center justify-center transition-all ${
            isRecording
              ? 'border-rose-800/80 bg-rose-950/30 animate-pulse'
              : recordBlob
              ? 'border-emerald-700/60 bg-emerald-950/20'
              : 'border-[#262626] bg-[#141414]'
          }`}
        >
          <div
            className={`w-13 h-13 rounded-xl flex items-center justify-center mb-3 ${
              isRecording
                ? 'bg-rose-600 text-white'
                : recordBlob
                ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-400'
                : 'bg-[#1e1e1e] border border-[#333] text-gray-300'
            }`}
          >
            <Mic className="w-6 h-6" />
          </div>

          {isRecording ? (
            <div>
              <h3 className="font-bold text-rose-400 text-base mb-1 flex items-center justify-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                ກຳລັງບັນທຶກສຽງ...
              </h3>
              <p className="text-2xl font-mono font-bold text-white my-2">
                {formatSeconds(recordDuration)}
              </p>
              <button
                id="btn-stop-recording"
                type="button"
                onClick={stopRecording}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 shadow-sm transition-colors cursor-pointer"
              >
                <Square className="w-3.5 h-3.5 fill-white" />
                <span>ຢຸດການບັນທຶກ</span>
              </button>
            </div>
          ) : recordBlob ? (
            <div>
              <h3 className="font-semibold text-gray-200 text-base mb-1">
                ບັນທຶກສຽງສຳເລັດ ({formatSeconds(recordDuration)})
              </h3>
              <p className="text-xs text-gray-400 mb-3">ພ້ອມຖອດຂໍ້ຄວາມ ແລະ ແຍກຜູ້ເວົ້າ</p>
              <div className="flex gap-2 justify-center">
                <button
                  id="btn-record-again"
                  type="button"
                  onClick={startRecording}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#333] bg-[#1c1c1c] text-xs font-medium text-gray-300 hover:bg-[#252525] transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>ບັນທຶກໃໝ່</span>
                </button>
                <button
                  type="button"
                  onClick={cancelRecording}
                  className="text-xs text-rose-400 hover:underline px-2 py-1"
                >
                  ຍົກເລີກ
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="font-semibold text-gray-200 text-base mb-1">ບັນທຶກສຽງຜ່ານໄມໂຄຣໂຟນ</h3>
              <p className="text-xs text-gray-400 mb-3">ກົດເພື່ອເລີ່ມບັນທຶກສຽງສົນທະນາ ຫຼື ການປະຊຸມສົດ</p>
              <button
                id="btn-start-recording"
                type="button"
                onClick={startRecording}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow-sm transition-colors cursor-pointer"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>ເລີ່ມບັນທຶກສຽງ</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Audio playback preview if selected */}
      {previewAudioUrl && (
        <div className="mt-4 p-3 bg-[#151515] border border-[#262626] rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="p-2 bg-indigo-600 text-white rounded-lg">
              <FileAudio className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-semibold text-gray-200 truncate max-w-xs sm:max-w-md">
                {selectedFile ? selectedFile.name : 'ສຽງບັນທຶກຈາກໄມໂຄຣໂຟນ'}
              </div>
              <div className="text-xs text-gray-500">ກົດຟັງສຽງກວດສອບກ່ອນຖອດຂໍ້ຄວາມ</div>
            </div>
          </div>
          <audio src={previewAudioUrl} controls className="h-8 w-full sm:w-80" />
        </div>
      )}

      {/* Advanced Settings toggle */}
      <div className="mt-5 pt-4 border-t border-[#222]">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-gray-200 transition-colors"
        >
          <Sliders className="w-3.5 h-3.5 text-indigo-400" />
          <span>ການຕັ້ງຄ່າເພີ່ມເຕີມ (ຕົວເລືອກໂມເດວ & ຄຳແນະນຳຜູ້ເວົ້າ)</span>
          {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showAdvanced && (
          <div className="mt-3 p-4 bg-[#151515] rounded-xl border border-[#262626] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-medium text-gray-300 mb-1">ໂມເດວ AI ທີ່ໃຊ້:</label>
              <select
                value={modelChoice}
                onChange={(e) => setModelChoice(e.target.value as any)}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-md p-2 text-gray-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="gemini-3.5-transcribe">gemini-3.5-transcribe (ແນະນຳສຳລັບສຽງ)</option>
                <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (ໄວ ແລະ ໝັ້ນຄົງ)</option>
                <option value="gemini-3.8-flash">gemini-3.8-flash (Multi-modal Flash)</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-gray-300 mb-1">
                ຄຳແນະນຳຈຳນວນ ຫຼື ຊື່ຜູ້ເວົ້າ (ຖ້າມີ):
              </label>
              <input
                type="text"
                value={speakersHint}
                onChange={(e) => setSpeakersHint(e.target.value)}
                placeholder="ເຊັ່ນ: 2 ຄົນ (ສົມສັກ, ວິໄລ)"
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-md p-2 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-300 mb-1">
                ບໍລິບົດ ຫຼື ຫົວຂໍ້ການສົນທະນາ:
              </label>
              <input
                type="text"
                value={contextHint}
                onChange={(e) => setContextHint(e.target.value)}
                placeholder="ເຊັ່ນ: ກອງປະຊຸມໄອທີ, ການສຳພາດແພດ"
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-md p-2 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Submit button */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>ພ້ອມສົ່ງອອກໄຟລ໌ Word (.docx) ແລະ Docs ໄດ້ທັນທີຫຼັງຈາກຖອດສຽງ</span>
        </div>

        <button
          id="btn-transcribe-submit"
          type="button"
          disabled={(!selectedFile && !recordBlob) || isLoading || isRecording}
          onClick={handleSubmit}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-md font-medium text-xs sm:text-sm transition-all shadow-sm ${
            (!selectedFile && !recordBlob) || isLoading || isRecording
              ? 'bg-[#1a1a1a] text-gray-600 border border-[#2a2a2a] cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer active:scale-98'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>ກຳລັງຖອດສຽງ & ແຍກຜູ້ເວົ້າ...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>ເລີ່ມຖອດຂໍ້ຄວາມສຽງ (Transcribe)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
