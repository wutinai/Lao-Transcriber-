import { TranscriptionData } from '../types';

/**
 * Generates an HTML-based document that can be downloaded as .doc
 * which opens seamlessly in Microsoft Word, LibreOffice, and Google Docs with full styling and Lao typography.
 */
export function generateDocsHtml(data: TranscriptionData): string {
  const speakerColors = ['#0284c7', '#16a34a', '#db2777', '#ea580c', '#9333ea', '#0891b2'];

  return `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(data.title || 'ບົດບັນທຶກການຖອດສຽງສົນທະນາ')}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Lao:wght@400;600;700&display=swap');
    body {
      font-family: 'Noto Sans Lao', 'Saysettha OT', 'Phetsarath OT', Arial, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      margin: 40px auto;
      max-width: 800px;
    }
    h1 {
      color: #0f172a;
      text-align: center;
      font-size: 24pt;
      margin-bottom: 6px;
    }
    .subtitle {
      text-align: center;
      color: #64748b;
      font-size: 11pt;
      margin-bottom: 24px;
    }
    .meta-box {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 28px;
    }
    .meta-row {
      display: flex;
      margin-bottom: 8px;
      font-size: 10.5pt;
    }
    .meta-label {
      font-weight: bold;
      width: 150px;
      color: #475569;
    }
    h2 {
      color: #1e293b;
      font-size: 15pt;
      border-bottom: 2px solid #cbd5e1;
      padding-bottom: 6px;
      margin-top: 24px;
    }
    .summary-text {
      font-size: 12pt;
      background-color: #f1f5f9;
      padding: 14px 18px;
      border-left: 4px solid #0284c7;
      border-radius: 4px;
      margin-bottom: 20px;
    }
    .key-points {
      padding-left: 20px;
      font-size: 11.5pt;
    }
    .key-points li {
      margin-bottom: 8px;
    }
    .dialogue-item {
      margin-bottom: 16px;
      padding: 10px 14px;
      background-color: #ffffff;
      border-bottom: 1px solid #f1f5f9;
    }
    .speaker-header {
      font-size: 11pt;
      font-weight: bold;
      margin-bottom: 4px;
    }
    .timestamp {
      color: #64748b;
      font-size: 9.5pt;
      font-family: monospace;
      margin-right: 8px;
    }
    .speech-text {
      font-size: 12pt;
      margin: 4px 0 0 0;
      color: #0f172a;
    }
    .original-text {
      font-size: 10pt;
      color: #64748b;
      font-style: italic;
      margin-top: 4px;
    }
    .footer {
      margin-top: 40px;
      border-top: 1px solid #cbd5e1;
      padding-top: 12px;
      font-size: 9pt;
      color: #94a3b8;
      text-align: center;
    }
  </style>
</head>
<body>
  <h1>${escapeHtml(data.title || 'ບົດບັນທຶກການຖອດສຽງສົນທະນາ')}</h1>
  <div class="subtitle">ລະບົບຖອດຂໍ້ຄວາມສຽງ ແຍກຜູ້ເວົ້າເປັນພາສາລາວ (Lao Audio Transcription with Diarization)</div>

  <table class="meta-box" width="100%" cellpadding="6" cellspacing="0">
    <tr>
      <td width="25%" style="font-weight:bold; color:#475569; background-color:#f1f5f9;">ຊື່ໄຟລ໌ສຽງ:</td>
      <td width="75%">${escapeHtml(data.fileName || 'ໄຟລ໌ສຽງບັນທຶກ')}</td>
    </tr>
    <tr>
      <td style="font-weight:bold; color:#475569; background-color:#f1f5f9;">ວັນທີ ແລະ ເວລາ:</td>
      <td>${escapeHtml(data.date)}</td>
    </tr>
    <tr>
      <td style="font-weight:bold; color:#475569; background-color:#f1f5f9;">ຄວາມຍາວສຽງ:</td>
      <td>${escapeHtml(data.durationFormatted || 'ບໍ່ລະບຸ')}</td>
    </tr>
    <tr>
      <td style="font-weight:bold; color:#475569; background-color:#f1f5f9;">ຈຳນວນຜູ້ເວົ້າ:</td>
      <td>${data.speakers.length} ຄົນ (${escapeHtml(data.speakers.map((s) => s.name).join(', '))})</td>
    </tr>
  </table>

  <h2>໑. ບົດສະຫຼຸບຫຍໍ້ (Executive Summary)</h2>
  <div class="summary-text">${escapeHtml(data.summaryLao || 'ບໍ່ມີບົດສະຫຼຸບຫຍໍ້')}</div>

  ${
    data.keyPointsLao && data.keyPointsLao.length > 0
      ? `<h2>໒. ຈຸດສຳຄັນຂອງການສົນທະນາ (Key Discussion Points)</h2>
         <ul class="key-points">
           ${data.keyPointsLao.map((pt) => `<li>${escapeHtml(pt)}</li>`).join('')}
         </ul>`
      : ''
  }

  <h2>໓. ລາຍລະອຽດການສົນທະນາແຍກຕາມຜູ້ເວົ້າ (Speaker Diarization)</h2>
  <div class="dialogue-container">
    ${data.segments
      .map((seg) => {
        const color = speakerColors[(seg.speakerId - 1) % speakerColors.length] || '#0284c7';
        return `
      <div class="dialogue-item">
        <div class="speaker-header">
          <span class="timestamp">[${escapeHtml(seg.timeDisplay)}]</span>
          <span style="color: ${color}; font-weight: 700;">${escapeHtml(seg.speaker)}:</span>
        </div>
        <p class="speech-text">${escapeHtml(seg.textLao)}</p>
        ${
          seg.originalText && seg.originalText !== seg.textLao
            ? `<div class="original-text">(ຕົ້ນສະບັບ: ${escapeHtml(seg.originalText)})</div>`
            : ''
        }
      </div>
    `;
      })
      .join('')}
  </div>

  <div class="footer">
    ສ້າງໂດຍ ລະບົບຖອດສຽງພາສາລາວ AI Transcriber &bull; ສົ່ງອອກສຳລັບ Google Docs ແລະ Microsoft Word
  </div>
</body>
</html>`;
}

export function downloadDocsFile(data: TranscriptionData, filename = 'lao-transcription.doc') {
  const htmlContent = generateDocsHtml(data);
  const blob = new Blob(['\ufeff' + htmlContent], {
    type: 'application/msword;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadTextFile(text: string, filename = 'lao-transcription.txt') {
  const blob = new Blob(['\ufeff' + text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function generateMarkdown(data: TranscriptionData): string {
  let md = `# ${data.title || 'ບົດບັນທຶກການຖອດສຽງສົນທະນາ'}\n\n`;
  md += `> ລະບົບຖອດຂໍ້ຄວາມສຽງ ແຍກຜູ້ເວົ້າເປັນພາສາລາວ\n\n`;
  md += `**ໄຟລ໌:** ${data.fileName || 'ໄຟລ໌ສຽງ'}\n`;
  md += `**ວັນທີ:** ${data.date}\n`;
  md += `**ຄວາມຍາວ:** ${data.durationFormatted || 'ບໍ່ລະບຸ'}\n`;
  md += `**ຜູ້ເວົ້າ:** ${data.speakers.map((s) => s.name).join(', ')}\n\n`;
  md += `---\n\n`;
  md += `## ໑. ບົດສະຫຼຸບຫຍໍ້\n\n${data.summaryLao}\n\n`;

  if (data.keyPointsLao && data.keyPointsLao.length > 0) {
    md += `## ໒. ຈຸດສຳຄັນ\n\n`;
    data.keyPointsLao.forEach((pt) => {
      md += `- ${pt}\n`;
    });
    md += `\n`;
  }

  md += `## ໓. ລາຍລະອຽດການສົນທະນາຕາມຜູ້ເວົ້າ\n\n`;
  data.segments.forEach((seg) => {
    md += `**[${seg.timeDisplay}] ${seg.speaker}:**\n`;
    md += `${seg.textLao}\n`;
    if (seg.originalText && seg.originalText !== seg.textLao) {
      md += `*(ຕົ້ນສະບັບ: ${seg.originalText})*\n`;
    }
    md += `\n`;
  });

  return md;
}

export async function copyFormattedToClipboard(data: TranscriptionData): Promise<boolean> {
  try {
    const htmlContent = generateDocsHtml(data);
    const plainText = generateMarkdown(data);

    if (navigator.clipboard && window.ClipboardItem) {
      const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
      const textBlob = new Blob([plainText], { type: 'text/plain' });
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': htmlBlob,
          'text/plain': textBlob,
        }),
      ]);
      return true;
    } else {
      await navigator.clipboard.writeText(plainText);
      return true;
    }
  } catch (err) {
    console.error('Failed to copy to clipboard', err);
    return false;
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
