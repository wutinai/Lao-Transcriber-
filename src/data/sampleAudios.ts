import { TranscriptionData } from '../types';

export interface SampleAudioItem {
  id: string;
  title: string;
  titleLao: string;
  category: string;
  duration: string;
  speakersCount: number;
  description: string;
  data: TranscriptionData;
}

export const SAMPLE_CONVERSATIONS: SampleAudioItem[] = [
  {
    id: 'meeting-project',
    title: 'Project Planning & Strategy Meeting',
    titleLao: 'ກອງປະຊຸມວາງແຜນພັດທະນາໂຄງການດິຈິຕອນ ປະຈຳໄຕມາດ',
    category: 'ກອງປະຊຸມທຸລະກິດ (Business Meeting)',
    duration: '03:45',
    speakersCount: 2,
    description: 'ການສົນທະນາລະຫວ່າງຫົວໜ້າໂຄງການ ແລະ ຫົວໜ້ານັກພັດທະນາ ກ່ຽວກັບການສົ່ງມອບວຽກ ແລະ ລະບົບ Cloud',
    data: {
      id: 'transcription-sample-1',
      title: 'ບົດບັນທຶກ: ກອງປະຊຸມວາງແຜນພັດທະນາໂຄງການດິຈິຕອນ',
      date: '05 ກັນຍາ 2026, 09:30',
      durationSeconds: 225,
      durationFormatted: '03:45 ນາທີ',
      language: 'ພາສາລາວ (Lao)',
      targetLanguage: 'ພາສາລາວ (Lao)',
      fileName: 'Meeting_Quarterly_Strategy_2026.mp3',
      fileSize: '4.8 MB',
      modelUsed: 'gemini-3.5-transcribe',
      summaryLao:
        'ກອງປະຊຸມປຶກສາຫາລືກ່ຽວກັບຄວາມຄືບໜ້າຂອງໂຄງການລະບົບດິຈິຕອນໃໝ່ ໂດຍມີການກຳນົດເສັ້ນຕາຍການທົດສອບລະບົບ (UAT) ພາຍໃນທ້າຍເດືອນນີ້ ແລະ ຕົກລົງຍ້າຍຖານຂໍ້ມູນໄປໄວ້ເທິງລະບົບ Cloud ເພື່ອເພີ່ມຄວາມປອດໄພ ແລະ ຄວາມໄວໃນການເຂົ້າເຖິງຂໍ້ມູນ.',
      keyPointsLao: [
        'ການທົດສອບລະບົບ (User Acceptance Testing) ຈະເລີ່ມວັນທີ 20 ຂອງເດືອນນີ້.',
        'ລະບົບ Cloud ໄດ້ຮັບການຕິດຕັ້ງສຳເລັດ ພ້ອມມາດຕະຖານຄວາມປອດໄພຂັ້ນສູງ.',
        'ທີມງານຈະຈັດການຝຶກອົບຮົມການນຳໃຊ້ລະບົບໃຫ້ພະນັກງານທັງໝົດໃນອາທິດຕໍ່ໄປ.',
        'ງົບປະມານໂຄງການຍັງຢູ່ໃນເກນທີ່ກຳນົດໄວ້ ແລະ ບໍ່ມີຄ່າໃຊ້ຈ່າຍເພີ່ມເຕີມ.',
      ],
      speakers: [
        { id: 1, name: 'ທ່ານ ສົມສັກ', originalLabel: 'ຜູ້ເວົ້າ 1', color: '#0284c7', role: 'ຜູ້ຈັດການໂຄງການ' },
        { id: 2, name: 'ນາງ ວິໄລ', originalLabel: 'ຜູ້ເວົ້າ 2', color: '#16a34a', role: 'ຫົວໜ້ານັກພັດທະນາ' },
      ],
      segments: [
        {
          id: 'seg-1',
          speaker: 'ທ່ານ ສົມສັກ',
          speakerId: 1,
          timeStart: '00:00',
          timeEnd: '00:32',
          timeDisplay: '00:00 - 00:32',
          textLao:
            'ສະບາຍດີຕອນເຊົ້າທຸກທ່ານ, ມື້ນີ້ເຮົາມາປະຊຸມຕິດຕາມຄວາມຄືບໜ້າຂອງໂຄງການລະບົບດິຈິຕອນ. ຢາກຖາມທ່ານວິໄລວ່າ ຄວາມຄືບໜ້າຂອງທີມງານພັດທະນາໃນອາທິດນີ້ເປັນແນວໃດແດ່?',
        },
        {
          id: 'seg-2',
          speaker: 'ນາງ ວິໄລ',
          speakerId: 2,
          timeStart: '00:33',
          timeEnd: '01:15',
          timeDisplay: '00:33 - 01:15',
          textLao:
            'ສະບາຍດີທ່ານສົມສັກ, ສຳລັບອາທິດນີ້ ທີມງານໄດ້ເຊື່ອມຕໍ່ລະບົບ API ກັບຖານຂໍ້ມູນຫຼັກສຳເລັດແລ້ວ ປະມານ 90%. ສ່ວນທີ່ເຫຼືອແມ່ນກວດສອບຄວາມຖືກຕ້ອງ ແລະ ທົດສອບການໂຫຼດຂໍ້ມູນຈຳນວນຫຼາຍ.',
        },
        {
          id: 'seg-3',
          speaker: 'ທ່ານ ສົມສັກ',
          speakerId: 1,
          timeStart: '01:16',
          timeEnd: '01:50',
          timeDisplay: '01:16 - 01:50',
          textLao:
            'ດີຫຼາຍ! ແລ້ວເລື່ອງຄວາມປອດໄພເທິງລະບົບ Cloud ເດ? ໄດ້ມີການທົດສອບການປ້ອງກັນຂໍ້ມູນຮົ່ວໄຫຼແລ້ວຫຼືຍັງ?',
        },
        {
          id: 'seg-4',
          speaker: 'ນາງ ວິໄລ',
          speakerId: 2,
          timeStart: '01:51',
          timeEnd: '02:40',
          timeDisplay: '01:51 - 02:40',
          textLao:
            'ເຮົາໄດ້ເປີດໃຊ້ລະບົບເຂົ້າລະຫັດຂໍ້ມູນແບບ End-to-End Encryption ແລະ ລະບົບຢືນຢັນຕົວຕົນ 2 ຊັ້ນ (2FA) ຮຽບຮ້ອຍແລ້ວ. ຜົນການທົດສອບຄວາມປອດໄພຜ່ານມາດຕະຖານທັງໝົດ.',
        },
        {
          id: 'seg-5',
          speaker: 'ທ່ານ ສົມສັກ',
          speakerId: 1,
          timeStart: '02:41',
          timeEnd: '03:45',
          timeDisplay: '02:41 - 03:45',
          textLao:
            'ຍອດຢ້ຽມຫຼາຍ. ຄັນຊັ້ນ ເຮົາກຳນົດໃຫ້ເລີ່ມທົດສອບລະບົບກັບຜູ້ໃຊ້ຕົວຈິງ (UAT) ໃນວັນທີ 20 ນີ້ເລີຍເນາະ. ຂອບໃຈທ່ານວິໄລ ແລະ ທີມງານທຸກຄົນຫຼາຍໆ.',
        },
      ],
      rawLaoText: `ບົດບັນທຶກ: ກອງປະຊຸມວາງແຜນພັດທະນາໂຄງການດິຈິຕອນ\n\n[00:00 - 00:32] ທ່ານ ສົມສັກ: ສະບາຍດີຕອນເຊົ້າທຸກທ່ານ, ມື້ນີ້ເຮົາມາປະຊຸມຕິດຕາມຄວາມຄືບໜ້າຂອງໂຄງການລະບົບດິຈິຕອນ. ຢາກຖາມທ່ານວິໄລວ່າ ຄວາມຄືບໜ້າຂອງທີມງານພັດທະນາໃນອາທິດນີ້ເປັນແນວໃດແດ່?\n\n[00:33 - 01:15] ນາງ ວິໄລ: ສະບາຍດີທ່ານສົມສັກ, ສຳລັບອາທິດນີ້ ທີມງານໄດ້ເຊື່ອມຕໍ່ລະບົບ API ກັບຖານຂໍ້ມູນຫຼັກສຳເລັດແລ້ວ ປະມານ 90%. ສ່ວນທີ່ເຫຼືອແມ່ນກວດສອບຄວາມຖືກຕ້ອງ ແລະ ທົດສອບການໂຫຼດຂໍ້ມູນຈຳນວນຫຼາຍ.\n\n[01:16 - 01:50] ທ່ານ ສົມສັກ: ດີຫຼາຍ! ແລ້ວເລື່ອງຄວາມປອດໄພເທິງລະບົບ Cloud ເດ? ໄດ້ມີການທົດສອບການປ້ອງກັນຂໍ້ມູນຮົ່ວໄຫຼແລ້ວຫຼືຍັງ?\n\n[01:51 - 02:40] ນາງ ວິໄລ: ເຮົາໄດ້ເປີດໃຊ້ລະບົບເຂົ້າລະຫັດຂໍ້ມູນແບບ End-to-End Encryption ແລະ ລະບົບຢືນຢັນຕົວຕົນ 2 ຊັ້ນ (2FA) ຮຽບຮ້ອຍແລ້ວ. ຜົນການທົດສອບຄວາມປອດໄພຜ່ານມາດຕະຖານທັງໝົດ.\n\n[02:41 - 03:45] ທ່ານ ສົມສັກ: ຍອດຢ້ຽມຫຼາຍ. ຄັນຊັ້ນ ເຮົາກຳນົດໃຫ້ເລີ່ມທົດສອບລະບົບກັບຜູ້ໃຊ້ຕົວຈິງ (UAT) ໃນວັນທີ 20 ນີ້ເລີຍເນາະ. ຂອບໃຈທ່ານວິໄລ ແລະ ທີມງານທຸກຄົນຫຼາຍໆ.`,
    },
  },
  {
    id: 'interview-ai',
    title: 'Technology & AI Discussion',
    titleLao: 'ການສຳພາດ: ອະນາຄົດຂອງເຕັກໂນໂລຊີ AI ໃນ ສປປ ລາວ',
    category: 'ການສຳພາດ (Interview)',
    duration: '04:12',
    speakersCount: 3,
    description: 'ລາຍການສຳພາດພິເສດກ່ຽວກັບການປະຍຸກໃຊ້ປັນຍາປະດິດ (AI) ໃນພາກລັດ ແລະ ທຸລະກິດລາວ',
    data: {
      id: 'transcription-sample-2',
      title: 'ການສຳພາດ: ອະນາຄົດຂອງເຕັກໂນໂລຊີ AI ໃນ ສປປ ລາວ',
      date: '04 ກັນຍາ 2026, 14:00',
      durationSeconds: 252,
      durationFormatted: '04:12 ນາທີ',
      language: 'ພາສາລາວ (Lao)',
      targetLanguage: 'ພາສາລາວ (Lao)',
      fileName: 'Interview_AI_Future_Laos.wav',
      fileSize: '7.2 MB',
      modelUsed: 'gemini-3.5-transcribe',
      summaryLao:
        'ບົດສຳພາດກ່ຽວກັບທ່າແຮງຂອງປັນຍາປະດິດ (AI) ໃນການຍົກລະດັບການສຶກສາ, ກະສິກຳ ແລະ ການບໍລິຫານລັດຖະບານດິຈິຕອນ ໂດຍເນັ້ນໜັກການພັດທະນາບຸກຄະລາກອນ ແລະ ການສ້າງຂໍ້ມູນພາສາລາວໃຫ້ແກ່ລະບົບ AI.',
      keyPointsLao: [
        'AI ສາມາດຊ່ວຍເພີ່ມຜົນຜະລິດກະສິກຳດ້ວຍການພະຍາກອນອາກາດ ແລະ ວິເຄາະດິນ.',
        'ຄວາມສຳຄັນຂອງການສ້າງຊຸດຂໍ້ມູນ (Dataset) ພາສາລາວ ໃຫ້ມີຄຸນນະພາບສູງ.',
        'ການຮ່ວມມືລະຫວ່າງມະຫາວິທະຍາໄລ ແລະ ພາກທຸລະກິດເພື່ອຝຶກອົບຮົມວິສະວະກອນ AI.',
      ],
      speakers: [
        { id: 1, name: 'ທ່ານ ຄຳຫຼ້າ (ພິທີກອນ)', originalLabel: 'ຜູ້ເວົ້າ 1', color: '#0284c7', role: 'ພິທີກອນ' },
        { id: 2, name: 'ດຣ. ບຸນມີ', originalLabel: 'ຜູ້ເວົ້າ 2', color: '#16a34a', role: 'ຊ່ຽວຊານ AI' },
        { id: 3, name: 'ນາງ ແກ້ວມະນີ', originalLabel: 'ຜູ້ເວົ້າ 3', color: '#db2777', role: 'ຜູ້ປະກອບການ Start-up' },
      ],
      segments: [
        {
          id: 'seg-1',
          speaker: 'ທ່ານ ຄຳຫຼ້າ (ພິທີກອນ)',
          speakerId: 1,
          timeStart: '00:00',
          timeEnd: '00:45',
          timeDisplay: '00:00 - 00:45',
          textLao:
            'ຍິນດີຕ້ອນຮັບທ່ານຜູ້ຊົມເຂົ້າສູ່ລາຍການເທັກໂນໂລຊີມື້ນີ້. ຫົວຂໍ້ພິເສດແມ່ນການນຳໃຊ້ AI ເຂົ້າໃນການພັດທະນາເສດຖະກິດລາວ. ຂໍຖາມ ດຣ. ບຸນມີ ວ່າ AI ຈະປ່ຽນແປງວິຖີຊີວິດເຮົາແນວໃດແດ່?',
        },
        {
          id: 'seg-2',
          speaker: 'ດຣ. ບຸນມີ',
          speakerId: 2,
          timeStart: '00:46',
          timeEnd: '01:55',
          timeDisplay: '00:46 - 01:55',
          textLao:
            'ຂອບໃຈທ່ານຄຳຫຼ້າ. ສຳລັບປະເທດລາວເຮົາ ຈຸດເລີ່ມຕົ້ນທີ່ດີທີ່ສຸດແມ່ນຂະແໜງກະສິກຳ ແລະ ການສຶກສາ. AI ສາມາດຊ່ວຍຊາວກະສິກອນກວດພະຍາດພືດຜ່ານໂທລະສັບ ແລະ ຊ່ວຍນັກຮຽນຮຽນພາສາຕ່າງປະເທດໄດ້ຢ່າງວ່ອງໄວ.',
        },
        {
          id: 'seg-3',
          speaker: 'ນາງ ແກ້ວມະນີ',
          speakerId: 3,
          timeStart: '01:56',
          timeEnd: '02:50',
          timeDisplay: '01:56 - 02:50',
          textLao:
            'ໃນມຸມມອງຂອງຜູ້ປະກອບການ Start-up ພວກເຮົາເຫັນວ່າການຖອດສຽງພາສາລາວ ແລະ ການແປພາສາອັດຕະໂນມັດ ເປັນເຄື່ອງມືທີ່ຈຳເປັນຫຼາຍສຳລັບການເຮັດທຸລະກິດການຄ້າຊາຍແດນ ແລະ ການບໍລິການລູກຄ້າ.',
        },
        {
          id: 'seg-4',
          speaker: 'ທ່ານ ຄຳຫຼ້າ (ພິທີກອນ)',
          speakerId: 1,
          timeStart: '02:51',
          timeEnd: '04:12',
          timeDisplay: '02:51 - 04:12',
          textLao:
            'ເປັນທັດສະນະທີ່ໜ້າສົນໃຈຫຼາຍ. ຂໍຂອບໃຈທ່ານວິທະຍາກອນທັງສອງທ່ານທີ່ມາແບ່ງປັນຄວາມຮູ້ທີ່ມີຄຸນຄ່າໃນມື້ນີ້.',
        },
      ],
      rawLaoText: `ການສຳພາດ: ອະນາຄົດຂອງເຕັກໂນໂລຊີ AI ໃນ ສປປ ລາວ\n\n[00:00 - 00:45] ທ່ານ ຄຳຫຼ້າ (ພິທີກອນ): ຍິນດີຕ້ອນຮັບທ່ານຜູ້ຊົມເຂົ້າສູ່ລາຍການເທັກໂນໂລຊີມື້ນີ້. ຫົວຂໍ້ພິເສດແມ່ນການນຳໃຊ້ AI ເຂົ້າໃນການພັດທະນາເສດຖະກິດລາວ. ຂໍຖາມ ດຣ. ບຸນມີ ວ່າ AI ຈະປ່ຽນແປງວິຖີຊີວິດເຮົາແນວໃດແດ່?\n\n[00:46 - 01:55] ດຣ. ບຸນມີ: ຂອບໃຈທ່ານຄຳຫຼ້າ. ສຳລັບປະເທດລາວເຮົາ ຈຸດເລີ່ມຕົ້ນທີ່ດີທີ່ສຸດແມ່ນຂະແໜງກະສິກຳ ແລະ ການສຶກສາ. AI ສາມາດຊ່ວຍຊາວກະສິກອນກວດພະຍາດພືດຜ່ານໂທລະສັບ ແລະ ຊ່ວຍນັກຮຽນຮຽນພາສາຕ່າງປະເທດໄດ້ຢ່າງວ່ອງໄວ.\n\n[01:56 - 02:50] ນາງ ແກ້ວມະນີ: ໃນມຸມມອງຂອງຜູ້ປະກອບການ Start-up ພວກເຮົາເຫັນວ່າການຖອດສຽງພາສາລາວ ແລະ ການແປພາສາອັດຕະໂນມັດ ເປັນເຄື່ອງມືທີ່ຈຳເປັນຫຼາຍສຳລັບການເຮັດທຸລະກິດການຄ້າຊາຍແດນ ແລະ ການບໍລິການລູກຄ້າ.\n\n[02:51 - 04:12] ທ່ານ ຄຳຫຼ້າ (ພິທີກອນ): ເປັນທັດສະນະທີ່ໜ້າສົນໃຈຫຼາຍ. ຂໍຂອບໃຈທ່ານວິທະຍາກອນທັງສອງທ່ານທີ່ມາແບ່ງປັນຄວາມຮູ້ທີ່ມີຄຸນຄ່າໃນມື້ນີ້.`,
    },
  },
];

/**
 * Generates an in-memory synthetic audio wav Blob using Web Audio API
 * so that sample audio is playable in the browser without requiring large external files!
 */
export function generateSyntheticAudioBlob(durationSeconds = 10): Blob {
  const sampleRate = 22050;
  const numSamples = sampleRate * durationSeconds;
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  // WAV Header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + numSamples * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size
  view.setUint16(20, 1, true); // AudioFormat PCM
  view.setUint16(22, 1, true); // NumChannels 1
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); // ByteRate
  view.setUint16(32, 2, true); // BlockAlign
  view.setUint16(34, 16, true); // BitsPerSample
  writeString(view, 36, 'data');
  view.setUint32(40, numSamples * 2, true);

  // Synthesize pleasant voice-like harmonic tones simulating dialogue cadence
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    // alternating pitches to simulate two people talking
    const speakerSwitch = Math.sin(t * 0.8) > 0;
    const baseFreq = speakerSwitch ? 220 : 330;
    // speech cadence envelope
    const cadence = 0.5 + 0.5 * Math.sin(t * 7) * Math.cos(t * 3);
    const sampleVal = Math.sin(2 * Math.PI * baseFreq * t) * 0.25 * cadence;
    view.setInt16(44 + i * 2, Math.floor(sampleVal * 32767), true);
  }

  return new Blob([view], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
