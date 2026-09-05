export interface TranscriptSegment {
  id: string;
  speaker: string;
  speakerId: number;
  timeStart: string; // e.g. "00:00"
  timeEnd: string;   // e.g. "00:24"
  timeDisplay: string; // e.g. "00:00 - 00:24"
  textLao: string;   // Lao transcript
  originalText?: string; // original language if different
  confidence?: number;
}

export interface SpeakerInfo {
  id: number;
  name: string;
  originalLabel: string;
  color: string;
  role?: string;
}

export interface TranscriptionData {
  id: string;
  title: string;
  date: string;
  durationSeconds?: number;
  durationFormatted: string;
  language: string;
  targetLanguage: string;
  summaryLao: string;
  keyPointsLao: string[];
  speakers: SpeakerInfo[];
  segments: TranscriptSegment[];
  rawLaoText: string;
  fileName?: string;
  fileSize?: string;
  modelUsed?: string;
}

export interface AudioInputSource {
  type: 'file' | 'mic' | 'sample';
  file?: File;
  blob?: Blob;
  url?: string;
  name: string;
  size?: number;
  mimeType: string;
  duration?: number;
}
