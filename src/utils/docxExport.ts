import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
} from 'docx';
import { TranscriptionData } from '../types';

export async function generateWordDocument(data: TranscriptionData): Promise<Blob> {
  // Speaker color map for text styling
  const speakerColors = ['0055A5', '2E7D32', 'C2185B', 'E65100', '6A1B9A', '00838F'];

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              bottom: 1440,
              left: 1440,
              right: 1440,
            },
          },
        },
        children: [
          // Title
          new Paragraph({
            text: data.title || 'ບົດບັນທຶກການຖອດສຽງສົນທະນາ',
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),

          // Subtitle / System note
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: 'ລະບົບຖອດຂໍ້ຄວາມສຽງ ແຍກຜູ້ເວົ້າເປັນພາສາລາວ (Lao Audio Transcription with Diarization)',
                italics: true,
                color: '666666',
                size: 20,
              }),
            ],
          }),

          // Metadata Table
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 25, type: WidthType.PERCENTAGE },
                    shading: { fill: 'F1F5F9' },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'ຊື່ໄຟລ໌ສຽງ:', bold: true, size: 20 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 75, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: data.fileName || 'ໄຟລ໌ສຽງບັນທຶກ', size: 20 })],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: 'F1F5F9' },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'ວັນທີ ແລະ ເວລາ:', bold: true, size: 20 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: data.date, size: 20 })],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: 'F1F5F9' },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'ຄວາມຍາວຂອງສຽງ:', bold: true, size: 20 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: data.durationFormatted || 'ບໍ່ລະບຸ', size: 20 })],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: 'F1F5F9' },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'ຈຳນວນຜູ້ເວົ້າ:', bold: true, size: 20 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `${data.speakers.length} ຄົນ (${data.speakers.map((s) => s.name).join(', ')})`,
                            size: 20,
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // Space
          new Paragraph({ spacing: { before: 300 } }),

          // Section 1: Executive Summary in Lao
          new Paragraph({
            text: '໑. ບົດສະຫຼຸບຫຍໍ້ຂອງການສົນທະນາ (Executive Summary)',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 },
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: data.summaryLao || 'ບໍ່ມີບົດສະຫຼຸບຫຍໍ້',
                size: 22,
              }),
            ],
          }),

          // Section 2: Key Points
          ...(data.keyPointsLao && data.keyPointsLao.length > 0
            ? [
                new Paragraph({
                  text: '໒. ຈຸດສຳຄັນ ແລະ ປະເດັນຫຼັກ (Key Discussion Points)',
                  heading: HeadingLevel.HEADING_2,
                  spacing: { before: 200, after: 150 },
                }),
                ...data.keyPointsLao.map(
                  (pt) =>
                    new Paragraph({
                      bullet: { level: 0 },
                      spacing: { after: 100 },
                      children: [new TextRun({ text: pt, size: 22 })],
                    })
                ),
              ]
            : []),

          // Section 3: Speaker Diarization Transcript
          new Paragraph({
            text: '໓. ລາຍລະອຽດການສົນທະນາແຍກຕາມຜູ້ເວົ້າ (Speaker Diarization)',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 200 },
          }),

          // List each dialogue segment
          ...data.segments.flatMap((seg, idx) => {
            const speakerColor = speakerColors[(seg.speakerId - 1) % speakerColors.length] || '0055A5';
            return [
              new Paragraph({
                spacing: { before: 180, after: 60 },
                children: [
                  new TextRun({
                    text: `[${seg.timeDisplay}] `,
                    bold: true,
                    color: '555555',
                    size: 20,
                  }),
                  new TextRun({
                    text: `${seg.speaker}:`,
                    bold: true,
                    color: speakerColor,
                    size: 22,
                  }),
                ],
              }),
              new Paragraph({
                spacing: { after: 140 },
                indent: { left: 400 },
                children: [
                  new TextRun({
                    text: seg.textLao,
                    size: 22,
                  }),
                  ...(seg.originalText && seg.originalText !== seg.textLao
                    ? [
                        new TextRun({
                          text: `\n(ຕົ້ນສະບັບ: ${seg.originalText})`,
                          italics: true,
                          color: '777777',
                          size: 19,
                        }),
                      ]
                    : []),
                ],
              }),
            ];
          }),

          // Footer info
          new Paragraph({
            spacing: { before: 600 },
            border: { top: { style: BorderStyle.SINGLE, size: 6, color: 'D1D5DB' } },
            children: [
              new TextRun({
                text: 'ສ້າງໂດຍ: ລະບົບຖອດສຽງພາສາລາວ AI Transcriber | ຮອງຮັບການສົ່ງອອກ Microsoft Word & Google Docs',
                italics: true,
                color: '888888',
                size: 18,
              }),
            ],
          }),
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
}

export function downloadWordDocument(blob: Blob, filename = 'lao-transcription.docx') {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
