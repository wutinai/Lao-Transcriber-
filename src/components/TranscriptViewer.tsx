import React, { useState } from 'react';
import {
  FileText,
  Download,
  Copy,
  Check,
  Search,
  Users,
  Edit2,
  Clock,
  MessageSquare,
  Sparkles,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  SlidersHorizontal,
  Share2,
} from 'lucide-react';
import { TranscriptionData, TranscriptSegment, SpeakerInfo } from '../types';

interface TranscriptViewerProps {
  data: TranscriptionData;
  onUpdateData: (newData: TranscriptionData) => void;
  onOpenExportModal: () => void;
  onSeekAudio?: (seconds: number) => void;
}

export const TranscriptViewer: React.FC<TranscriptViewerProps> = ({
  data,
  onUpdateData,
  onOpenExportModal,
  onSeekAudio,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpeakerId, setSelectedSpeakerId] = useState<number | 'all'>('all');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [copiedAll, setCopiedAll] = useState(false);

  // Speaker editing state
  const [editingSpeakerId, setEditingSpeakerId] = useState<number | null>(null);
  const [editingSpeakerName, setEditingSpeakerName] = useState('');

  // Segment editing state
  const [editingSegmentId, setEditingSegmentId] = useState<string | null>(null);
  const [editingSegmentText, setEditingSegmentText] = useState('');

  // Handle renaming speaker globally
  const startEditingSpeaker = (speaker: SpeakerInfo) => {
    setEditingSpeakerId(speaker.id);
    setEditingSpeakerName(speaker.name);
  };

  const saveSpeakerName = (speakerId: number) => {
    if (!editingSpeakerName.trim()) {
      setEditingSpeakerId(null);
      return;
    }

    const updatedSpeakers = data.speakers.map((s) =>
      s.id === speakerId ? { ...s, name: editingSpeakerName.trim() } : s
    );

    const updatedSegments = data.segments.map((seg) =>
      seg.speakerId === speakerId ? { ...seg, speaker: editingSpeakerName.trim() } : seg
    );

    const rawLines = updatedSegments.map(
      (s) => `[${s.timeDisplay}] ${s.speaker}:\n${s.textLao}\n`
    );

    onUpdateData({
      ...data,
      speakers: updatedSpeakers,
      segments: updatedSegments,
      rawLaoText: rawLines.join('\n'),
    });

    setEditingSpeakerId(null);
  };

  // Handle editing segment text
  const startEditingSegment = (seg: TranscriptSegment) => {
    setEditingSegmentId(seg.id);
    setEditingSegmentText(seg.textLao);
  };

  const saveSegmentText = (segmentId: string) => {
    const updatedSegments = data.segments.map((seg) =>
      seg.id === segmentId ? { ...seg, textLao: editingSegmentText.trim() } : seg
    );

    const rawLines = updatedSegments.map(
      (s) => `[${s.timeDisplay}] ${s.speaker}:\n${s.textLao}\n`
    );

    onUpdateData({
      ...data,
      segments: updatedSegments,
      rawLaoText: rawLines.join('\n'),
    });

    setEditingSegmentId(null);
  };

  // Parse time "00:32" to seconds for seeking
  const parseTimeToSeconds = (timeStr: string): number => {
    const parts = timeStr.split(':').map((p) => parseInt(p, 10));
    if (parts.length === 2) {
      return (parts[0] || 0) * 60 + (parts[1] || 0);
    }
    if (parts.length === 3) {
      return (parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
    }
    return 0;
  };

  const handleTimeClick = (timeStr: string) => {
    if (onSeekAudio) {
      const start = timeStr.split('-')[0].trim();
      const secs = parseTimeToSeconds(start);
      onSeekAudio(secs);
    }
  };

  // Filtered segments
  const filteredSegments = data.segments.filter((seg) => {
    const matchesSpeaker = selectedSpeakerId === 'all' || seg.speakerId === selectedSpeakerId;
    const matchesSearch =
      !searchQuery.trim() ||
      seg.textLao.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seg.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (seg.originalText && seg.originalText.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSpeaker && matchesSearch;
  });

  // Copy all raw text
  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(data.rawLaoText);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const fontClasses = {
    normal: 'text-sm sm:text-base leading-relaxed',
    large: 'text-base sm:text-lg leading-relaxed',
    xlarge: 'text-lg sm:text-xl leading-loose',
  }[fontSize];

  return (
    <div id="transcript-viewer-container" className="space-y-6">
      {/* Top action and title card */}
      <div className="bg-[#0f0f0f] rounded-xl shadow-lg border border-[#222] p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#222]">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-md bg-[#1a1a1a] text-gray-300 border border-[#333] text-xs font-semibold">
                {data.language}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#151515] text-gray-400 border border-[#262626] text-xs font-medium flex items-center gap-1">
                <Clock className="w-3 h-3 text-gray-500" />
                {data.durationFormatted}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-indigo-950/40 text-indigo-400 border border-indigo-900/40 text-xs font-medium flex items-center gap-1">
                <Users className="w-3 h-3 text-indigo-400" />
                {data.speakers.length} ຜູ້ເວົ້າ
              </span>
              {data.modelUsed && (
                <span className="px-2.5 py-1 rounded-md bg-purple-950/40 text-purple-400 border border-purple-900/40 text-xs font-mono">
                  {data.modelUsed}
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">
              {data.title}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              ວັນທີບັນທຶກ: {data.date} {data.fileName ? `• ໄຟລ໌: ${data.fileName}` : ''}
            </p>
          </div>

          {/* Primary Export CTA buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              id="btn-open-export-modal"
              type="button"
              onClick={onOpenExportModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>ດາວໂຫຼດ Word / Docs (.docx)</span>
            </button>

            <button
              type="button"
              onClick={handleCopyAll}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-md border border-[#333] bg-[#1a1a1a] hover:bg-[#252525] text-gray-300 font-medium text-xs sm:text-sm transition-colors cursor-pointer"
              title="ຄັດລອກຂໍ້ຄວາມທັງໝົດ"
            >
              {copiedAll ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedAll ? 'ຄັດລອກແລ້ວ' : 'ຄັດລອກທັງໝົດ'}</span>
            </button>
          </div>
        </div>

        {/* Executive Summary & Key points */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
          {/* Executive Summary */}
          <div className="lg:col-span-2 bg-gradient-to-br from-[#121212] to-indigo-950/20 rounded-xl p-5 border border-indigo-900/30">
            <div className="flex items-center gap-2 mb-2.5">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-indigo-300">
                ໑. ບົດສະຫຼຸບຫຍໍ້ຂອງການສົນທະນາ (Executive Summary)
              </h3>
            </div>
            <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-normal">
              {data.summaryLao || 'ບໍ່ມີບົດສະຫຼຸບ'}
            </p>
          </div>

          {/* Key Discussion Points */}
          <div className="bg-[#141414] rounded-xl p-5 border border-[#262626]">
            <h3 className="text-sm font-bold text-gray-200 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" />
              <span>໒. ຈຸດສຳຄັນຫຼັກ (Key Points)</span>
            </h3>
            {data.keyPointsLao && data.keyPointsLao.length > 0 ? (
              <ul className="space-y-2 text-xs sm:text-sm text-gray-300">
                {data.keyPointsLao.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-500">ບໍ່ມີຈຸດສຳຄັນ</p>
            )}
          </div>
        </div>

        {/* Speaker Management row */}
        <div className="mt-6 pt-6 border-t border-[#222] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              ຜູ້ເວົ້າໃນການສົນທະນາ:
            </span>
            {data.speakers.map((spk) => (
              <div
                key={spk.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[#333] bg-[#161616] text-xs font-medium text-gray-300 shadow-xs"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: spk.color }}
                />
                {editingSpeakerId === spk.id ? (
                  <input
                    type="text"
                    value={editingSpeakerName}
                    onChange={(e) => setEditingSpeakerName(e.target.value)}
                    onBlur={() => saveSpeakerName(spk.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveSpeakerName(spk.id);
                      if (e.key === 'Escape') setEditingSpeakerId(null);
                    }}
                    autoFocus
                    className="w-28 px-1.5 py-0.5 border border-indigo-500 bg-[#1e1e1e] text-white rounded-xs text-xs focus:outline-none"
                  />
                ) : (
                  <>
                    <span>{spk.name}</span>
                    {spk.role && <span className="text-gray-500 text-[10px]">({spk.role})</span>}
                    <button
                      type="button"
                      onClick={() => startEditingSpeaker(spk)}
                      className="text-gray-500 hover:text-indigo-400 p-0.5"
                      title="ປ່ຽນຊື່ຜູ້ເວົ້າ"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Font size control */}
          <div className="flex items-center gap-1.5 text-xs text-gray-400 shrink-0">
            <span>ຂະໜາດຟອນ:</span>
            <div className="inline-flex rounded-md border border-[#333] bg-[#161616] p-0.5">
              <button
                type="button"
                onClick={() => setFontSize('normal')}
                className={`px-2 py-0.5 rounded-xs text-xs font-medium transition-colors ${
                  fontSize === 'normal' ? 'bg-[#262626] text-white shadow-xs' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                ປົກກະຕິ
              </button>
              <button
                type="button"
                onClick={() => setFontSize('large')}
                className={`px-2 py-0.5 rounded-xs text-xs font-medium transition-colors ${
                  fontSize === 'large' ? 'bg-[#262626] text-white shadow-xs' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                ໃຫຍ່
              </button>
              <button
                type="button"
                onClick={() => setFontSize('xlarge')}
                className={`px-2 py-0.5 rounded-xs text-xs font-medium transition-colors ${
                  fontSize === 'xlarge' ? 'bg-[#262626] text-white shadow-xs' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                ໃຫຍ່ພິເສດ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Speaker filter tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setSelectedSpeakerId('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all shrink-0 cursor-pointer ${
              selectedSpeakerId === 'all'
                ? 'bg-indigo-600 text-white font-medium shadow-xs'
                : 'bg-[#141414] border border-[#262626] text-gray-400 hover:bg-[#1a1a1a] hover:text-gray-200'
            }`}
          >
            ທັງໝົດ ({data.segments.length})
          </button>
          {data.speakers.map((spk) => {
            const count = data.segments.filter((s) => s.speakerId === spk.id).length;
            const isSelected = selectedSpeakerId === spk.id;
            return (
              <button
                key={spk.id}
                type="button"
                onClick={() => setSelectedSpeakerId(spk.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all shrink-0 inline-flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white font-medium shadow-xs'
                    : 'bg-[#141414] border border-[#262626] text-gray-300 hover:bg-[#1a1a1a] hover:text-white'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: isSelected ? '#ffffff' : spk.color }}
                />
                <span>{spk.name}</span>
                <span className={`text-[10px] ${isSelected ? 'text-indigo-200' : 'text-gray-500'}`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ຄົ້ນຫາຄຳເວົ້າ ຫຼື ຫົວຂໍ້..."
            className="w-full pl-9 pr-3 py-2 bg-[#141414] border border-[#333] rounded-md text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500 shadow-xs"
          />
        </div>
      </div>

      {/* Dialogue Segments List (໓. ລາຍລະອຽດການສົນທະນາຕາມຜູ້ເວົ້າ) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-gray-400 px-1">
          <span className="font-semibold text-gray-300">
            ໓. ບົດສົນທະນາແຍກຕາມຜູ້ເວົ້າ ({filteredSegments.length} ລາຍການ):
          </span>
          <span className="text-[11px] text-gray-500">
            ກົດທີ່ເວລາ [00:xx] ເພື່ອຟັງສຽງຊ່ວງນັ້ນ ຫຼື ກົດແກ້ໄຂຂໍ້ຄວາມໄດ້
          </span>
        </div>

        {filteredSegments.length === 0 ? (
          <div className="bg-[#0f0f0f] rounded-xl p-12 text-center border border-[#222]">
            <p className="text-gray-500 text-sm">ບໍ່ພົບຂໍ້ຄວາມທີ່ກົງກັບເງື່ອນໄຂການຄົ້ນຫາ</p>
          </div>
        ) : (
          filteredSegments.map((seg, idx) => {
            const speaker = data.speakers.find((s) => s.id === seg.speakerId) || {
              color: '#818cf8',
              name: seg.speaker,
            };
            const isEditing = editingSegmentId === seg.id;

            return (
              <div
                key={seg.id}
                id={`segment-${seg.id}`}
                className="bg-[#0f0f0f] rounded-xl p-5 sm:p-6 border border-[#222] hover:border-[#2c2c2c] transition-all shadow-xs group"
              >
                {/* Segment Top row: Speaker & Timestamp */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md"
                      style={{
                        backgroundColor: speaker.color,
                        boxShadow: `0 4px 14px ${speaker.color}33`,
                      }}
                    >
                      {speaker.name.slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="font-bold text-sm sm:text-base"
                          style={{ color: speaker.color }}
                        >
                          {seg.speaker}
                        </span>
                        {speaker.role && (
                          <span className="text-gray-500 text-xs hidden sm:inline">
                            • {speaker.role}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions & Timestamp */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleTimeClick(seg.timeDisplay)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#181818] hover:bg-[#222] text-indigo-400 border border-[#2c2c2c] text-xs font-mono font-medium transition-colors cursor-pointer"
                      title="ກົດເພື່ອຟັງສຽງຊ່ວງນີ້"
                    >
                      <Clock className="w-3 h-3 text-gray-500" />
                      <span>{seg.timeDisplay}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => startEditingSegment(seg)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-500 hover:text-indigo-400 rounded-md hover:bg-[#1c1c1c] transition-all"
                      title="ແກ້ໄຂຂໍ້ຄວາມ"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Segment Text */}
                {isEditing ? (
                  <div className="mt-2">
                    <textarea
                      value={editingSegmentText}
                      onChange={(e) => setEditingSegmentText(e.target.value)}
                      rows={3}
                      className="w-full p-3 bg-[#141414] border border-indigo-500 text-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <div className="flex gap-2 justify-end mt-2">
                      <button
                        type="button"
                        onClick={() => saveSegmentText(seg.id)}
                        className="px-3 py-1.5 bg-indigo-600 text-white rounded-md text-xs font-semibold hover:bg-indigo-700"
                      >
                        ບັນທຶກ
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingSegmentId(null)}
                        className="px-3 py-1.5 bg-[#202020] text-gray-300 rounded-md text-xs font-medium hover:bg-[#2a2a2a]"
                      >
                        ຍົກເລີກ
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className={`text-gray-200 ${fontClasses} pl-13`}>
                    {seg.textLao}
                  </p>
                )}

                {/* Original text note if different */}
                {seg.originalText && seg.originalText !== seg.textLao && (
                  <div className="mt-2 pl-13 text-xs text-gray-500 italic">
                    ຕົ້ນສະບັບ: {seg.originalText}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
