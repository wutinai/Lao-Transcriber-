import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const PORT = 3000;

// Lazy initialization of Gemini client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in environment.');
    }
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

async function startServer() {
  const app = express();

  // Allow up to 50MB audio payloads
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // Audio transcription endpoint with speaker diarization & Lao output
  app.post('/api/transcribe', async (req, res) => {
    try {
      const { audioBase64, mimeType = 'audio/mp3', options = {} } = req.body;

      if (!audioBase64) {
        return res.status(400).json({
          error: 'ກະລຸນາສົ່ງຂໍ້ມູນສຽງ (audioBase64 is required)',
        });
      }

      const ai = getGenAI();

      // Clean base64 string if data URL prefix was sent
      const cleanBase64 = audioBase64.replace(/^data:audio\/[a-zA-Z0-9.+_-]+;base64,/, '');

      const audioPart = {
        inlineData: {
          mimeType: mimeType || 'audio/mp3',
          data: cleanBase64,
        },
      };

      const systemPrompt = `You are an expert audio transcriptionist and linguist specialized in Lao language (ພາສາລາວ) with advanced Speaker Diarization capabilities.
Your task:
1. Listen carefully to the entire audio recording.
2. Identify distinct speakers accurately (Diarization: e.g. "ຜູ້ເວົ້າ 1", "ຜູ້ເວົ້າ 2", or specific names if mentioned).
3. Transcribe each utterance accurately into Lao language (ພາສາລາວ) with clear formatting, correct Lao orthography, tone marks, and natural sentence flow.
4. If the audio is in Lao, transcribe it faithfully. If the audio contains Thai, English, or other languages, transcribe or translate the spoken meaning clearly and naturally into Lao so the final transcript is easy to read in Lao (ພາສາລາວ). Optionally include the original phrase in originalText if mixed.
5. Provide timestamps for each turn (e.g. "00:00 - 00:20").
6. Provide an Executive Summary of the conversation in Lao (ບົດສະຫຼຸບຫຍໍ້).
7. Provide 3-5 Key Points discussed in Lao (ຈຸດສຳຄັນ).
8. Return the result strictly in valid JSON matching the requested structure.`;

      const userInstruction = `ກະລຸນາຖອດຂໍ້ຄວາມສຽງນີ້ ໂດຍແຍກຜູ້ເວົ້າໃຫ້ຊັດເຈນ (Speaker Diarization) ແລະ ສະແດງຜົນເປັນພາສາລາວ (Lao Language) ທີ່ອ່ານງ່າຍ ແລະ ຖືກຕ້ອງຕາມຫຼັກໄວຍາກອນລາວ.
${options.context ? `ບໍລິບົດເພີ່ມເຕີມ: ${options.context}` : ''}
${options.speakersHint ? `ຈຳນວນ ຫຼື ລາຍຊື່ຜູ້ເວົ້າທີ່ຄາດໄວ້: ${options.speakersHint}` : ''}

Output strictly valid JSON with this format:
{
  "title": "ຫົວຂໍ້ການສົນທະນາ ຫຼື ການປະຊຸມເປັນພາສາລາວ",
  "summaryLao": "ບົດສະຫຼຸບຫຍໍ້ຂອງການສົນທະນາເປັນພາສາລາວ ປະມານ 2-4 ປະໂຫຍກ",
  "keyPointsLao": ["ຈຸດສຳຄັນທີ 1", "ຈຸດສຳຄັນທີ 2", "ຈຸດສຳຄັນທີ 3"],
  "speakers": [
    {"id": 1, "name": "ຜູ້ເວົ້າ 1", "role": "ບົດບາດ ຫຼື ໜ້າທີ່ (ຖ້າມີ)"},
    {"id": 2, "name": "ຜູ້ເວົ້າ 2", "role": "ບົດບາດ ຫຼື ໜ້າທີ່ (ຖ້າມີ)"}
  ],
  "segments": [
    {
      "speakerId": 1,
      "speaker": "ຜູ້ເວົ້າ 1",
      "timeStart": "00:00",
      "timeEnd": "00:25",
      "timeDisplay": "00:00 - 00:25",
      "textLao": "ຂໍ້ຄວາມທີ່ເວົ້າເປັນພາສາລາວ...",
      "originalText": "ຂໍ້ຄວາມຕົ້ນສະບັບ (ຖ້າມີ)"
    }
  ]
}`;

      // Model candidates: prioritize user choice or gemini-3.5-transcribe, with robust fallbacks to gemini-3.1-flash-lite and gemini-3.8-flash
      const candidateModels = Array.from(
        new Set([
          options.model || 'gemini-3.5-transcribe',
          'gemini-3.1-flash-lite',
          'gemini-3.8-flash',
        ])
      );

      let responseText = '';
      let usedModel = candidateModels[0];
      let lastError: any = null;

      for (const modelName of candidateModels) {
        try {
          console.log(`[Transcribe] Attempting transcription with model: ${modelName}`);
          const response = await ai.models.generateContent({
            model: modelName,
            contents: {
              parts: [audioPart, { text: `${systemPrompt}\n\n${userInstruction}` }],
            },
            config: {
              responseMimeType: 'application/json',
            },
          });
          responseText = response.text || '';
          usedModel = modelName;
          console.log(`[Transcribe] Successfully transcribed with: ${modelName}`);
          break;
        } catch (err: any) {
          console.warn(`[Transcribe] Model ${modelName} failed:`, err?.status || err?.message || err);
          lastError = err;
        }
      }

      if (!responseText && lastError) {
        let msg = lastError?.message || 'ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບລະບົບ AI ໄດ້';
        try {
          const parsed = JSON.parse(msg);
          if (parsed?.error?.message) msg = parsed.error.message;
        } catch {}
        throw new Error(msg);
      }

      // Parse JSON
      let parsedData: any;
      try {
        // Remove markdown formatting like ```json if any
        const cleaned = responseText
          .replace(/^```json\s*/i, '')
          .replace(/\s*```$/i, '')
          .trim();
        parsedData = JSON.parse(cleaned);
      } catch (parseErr) {
        console.error('[Transcribe] JSON parse error:', parseErr, responseText);
        // Fallback structure
        parsedData = {
          title: 'ບົດບັນທຶກການຖອດສຽງສົນທະນາ',
          summaryLao: 'ການຖອດຂໍ້ຄວາມສຽງສຳເລັດ',
          keyPointsLao: ['ໄດ້ຮັບຂໍ້ຄວາມຈາກໄຟລ໌ສຽງ'],
          speakers: [{ id: 1, name: 'ຜູ້ເວົ້າ 1' }],
          segments: [
            {
              speakerId: 1,
              speaker: 'ຜູ້ເວົ້າ 1',
              timeStart: '00:00',
              timeEnd: '01:00',
              timeDisplay: '00:00 - 01:00',
              textLao: responseText || 'ບໍ່ສາມາດສະແດງຂໍ້ຄວາມໄດ້',
            },
          ],
        };
      }

      // Format speaker colors
      const palette = ['#0284c7', '#16a34a', '#db2777', '#ea580c', '#9333ea', '#0891b2'];
      const enrichedSpeakers = (parsedData.speakers || []).map((spk: any, idx: number) => ({
        id: spk.id || idx + 1,
        name: spk.name || `ຜູ້ເວົ້າ ${idx + 1}`,
        originalLabel: spk.name || `ຜູ້ເວົ້າ ${idx + 1}`,
        color: palette[idx % palette.length],
        role: spk.role || '',
      }));

      // Enrich segments
      const enrichedSegments = (parsedData.segments || []).map((seg: any, idx: number) => ({
        id: `seg-${idx + 1}`,
        speakerId: seg.speakerId || 1,
        speaker: seg.speaker || `ຜູ້ເວົ້າ ${seg.speakerId || 1}`,
        timeStart: seg.timeStart || '00:00',
        timeEnd: seg.timeEnd || '',
        timeDisplay: seg.timeDisplay || (seg.timeEnd ? `${seg.timeStart} - ${seg.timeEnd}` : seg.timeStart || '00:00'),
        textLao: seg.textLao || seg.text || '',
        originalText: seg.originalText || '',
      }));

      // Build raw Lao formatted text for easy copying
      const rawLines = enrichedSegments.map(
        (s: any) => `[${s.timeDisplay}] ${s.speaker}:\n${s.textLao}\n`
      );

      const result = {
        id: `transcription-${Date.now()}`,
        title: parsedData.title || 'ບົດບັນທຶກການຖອດສຽງສົນທະນາ',
        date: new Date().toLocaleDateString('lo-LA', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        language: 'ພາສາລາວ (Lao)',
        targetLanguage: 'ພາສາລາວ (Lao)',
        summaryLao: parsedData.summaryLao || '',
        keyPointsLao: parsedData.keyPointsLao || [],
        speakers: enrichedSpeakers.length > 0 ? enrichedSpeakers : [{ id: 1, name: 'ຜູ້ເວົ້າ 1', color: '#0284c7' }],
        segments: enrichedSegments,
        rawLaoText: rawLines.join('\n'),
        modelUsed: usedModel,
      };

      return res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error('[Transcribe API Error]:', error);
      let errMsg = error?.message || 'ເກີດຂໍ້ຜິດພາດໃນການຖອດສຽງ (Failed to transcribe audio)';
      try {
        const parsed = JSON.parse(errMsg);
        if (parsed?.error?.message) {
          errMsg = parsed.error.message;
        }
      } catch {}
      return res.status(500).json({
        error: errMsg,
      });
    }
  });

  // Vite middleware for development vs static build for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Lao Audio Transcriber running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
