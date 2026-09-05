import React, { useState } from 'react';
import {
  FileText,
  Download,
  Copy,
  Check,
  Printer,
  FileCode,
  Sparkles,
  X,
  ExternalLink,
} from 'lucide-react';
import { TranscriptionData } from '../types';
import { generateWordDocument, downloadWordDocument } from '../utils/docxExport';
import {
  downloadDocsFile,
  downloadTextFile,
  generateMarkdown,
  copyFormattedToClipboard,
} from '../utils/docsExport';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: TranscriptionData;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, data }) => {
  const [isGeneratingDocx, setIsGeneratingDocx] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const baseFilename = (data.title || 'lao-transcription')
    .replace(/[^\w\u0E80-\u0EFF]/g, '_')
    .slice(0, 35);

  const handleExportWord = async () => {
    try {
      setIsGeneratingDocx(true);
      const blob = await generateWordDocument(data);
      downloadWordDocument(blob, `${baseFilename}.docx`);
    } catch (err) {
      console.error('Failed to export Word docx:', err);
      alert('ເກີດຂໍ້ຜິດພາດໃນການສ້າງໄຟລ໌ Word (.docx)');
    } finally {
      setIsGeneratingDocx(false);
    }
  };

  const handleExportDocs = () => {
    downloadDocsFile(data, `${baseFilename}.doc`);
  };

  const handleCopyRichText = async () => {
    const success = await copyFormattedToClipboard(data);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleExportText = () => {
    downloadTextFile(data.rawLaoText, `${baseFilename}.txt`);
  };

  const handleExportMarkdown = () => {
    const md = generateMarkdown(data);
    downloadTextFile(md, `${baseFilename}.md`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="export-modal-dialog"
        className="bg-[#121212] w-full max-w-xl rounded-xl shadow-2xl border border-[#262626] text-[#e0e0e0] overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-[#222] flex items-center justify-between bg-[#161616]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-950/60 border border-indigo-900/40 text-indigo-400 rounded-lg">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                ດາວໂຫຼດ ແລະ ສົ່ງອອກຂໍ້ຄວາມ (Export)
              </h3>
              <p className="text-xs text-gray-400">
                ເລືອກຮູບແບບໄຟລ໌ທີ່ຕ້ອງການນຳໄປໃຊ້ງານໃນ Word ຫຼື Google Docs
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-md hover:bg-[#222] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Main Option 1: Microsoft Word (.docx) */}
          <div className="p-4 rounded-xl border border-indigo-900/40 bg-indigo-950/20 hover:bg-indigo-950/30 transition-colors flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">
                W
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-white text-base">Microsoft Word (.docx)</h4>
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-900/50 text-indigo-300 border border-indigo-800/40 rounded-full">
                    ແນະນຳ (Recommended)
                  </span>
                </div>
                <p className="text-xs text-gray-300 mt-0.5 leading-relaxed">
                  ໄຟລ໌ Word ແທ້ ພ້ອມຕາຕະລາງລາຍລະອຽດ, ບົດສະຫຼຸບ, ຈຸດສຳຄັນ, ແລະ ສີແຍກຜູ້ເວົ້າຢ່າງເປັນລະບຽບ
                </p>
              </div>
            </div>
            <button
              id="btn-export-docx"
              type="button"
              disabled={isGeneratingDocx}
              onClick={handleExportWord}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-medium shrink-0 shadow-sm transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              {isGeneratingDocx ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>ກຳລັງສ້າງ...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>ດາວໂຫຼດ .docx</span>
                </>
              )}
            </button>
          </div>

          {/* Main Option 2: Google Docs / Word Document (.doc) */}
          <div className="p-4 rounded-xl border border-[#262626] bg-[#161616] hover:bg-[#1a1a1a] transition-colors flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">Google Docs / Web Doc (.doc)</h4>
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                  ສາມາດອັບໂຫຼດເປີດໃນ Google Docs ຫຼື Microsoft Word ໄດ້ໂດຍກົງ ພ້ອມຮູບແບບຕົວອັກສອນລາວ
                </p>
              </div>
            </div>
            <button
              id="btn-export-docs"
              type="button"
              onClick={handleExportDocs}
              className="px-4 py-2.5 bg-[#222] hover:bg-[#2c2c2c] border border-[#333] text-white rounded-md text-xs font-medium shrink-0 shadow-sm transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ດາວໂຫຼດ .doc</span>
            </button>
          </div>

          {/* Option 3: Copy to Clipboard for Google Docs */}
          <div className="p-4 rounded-xl border border-[#262626] bg-[#161616] hover:bg-[#1a1a1a] transition-colors flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                {copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
              </div>
              <div>
                <h4 className="font-bold text-white text-base">ຄັດລອກໃສ່ Clipboard (Formatted)</h4>
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                  ຄັດລອກຮູບແບບພ້ອມສີສັນ ແລະ ຫົວຂໍ້ ສາມາດກົດວາງ (Paste: Ctrl+V) ໃສ່ Google Docs ຫຼື Word ໄດ້ທັນທີ
                </p>
              </div>
            </div>
            <button
              id="btn-copy-clipboard"
              type="button"
              onClick={handleCopyRichText}
              className={`px-4 py-2.5 rounded-md text-xs font-medium shrink-0 shadow-sm transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#222] hover:bg-[#2c2c2c] text-gray-200 border border-[#333]'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>ຄັດລອກແລ້ວ!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>ຄັດລອກຂໍ້ຄວາມ</span>
                </>
              )}
            </button>
          </div>

          {/* Secondary Options Grid: Text, Markdown, Print */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <button
              type="button"
              onClick={handleExportText}
              className="p-3 rounded-xl border border-[#262626] bg-[#161616] hover:border-indigo-500/50 hover:bg-[#1c1c1c] text-left transition-colors flex items-center gap-2.5"
            >
              <FileCode className="w-4 h-4 text-gray-400" />
              <div>
                <div className="text-xs font-semibold text-gray-200">ຂໍ້ຄວາມດິບ (.txt)</div>
                <div className="text-[10px] text-gray-500">Plain text ບໍ່ມີຮູບແບບ</div>
              </div>
            </button>

            <button
              type="button"
              onClick={handleExportMarkdown}
              className="p-3 rounded-xl border border-[#262626] bg-[#161616] hover:border-indigo-500/50 hover:bg-[#1c1c1c] text-left transition-colors flex items-center gap-2.5"
            >
              <FileText className="w-4 h-4 text-gray-400" />
              <div>
                <div className="text-xs font-semibold text-gray-200">Markdown (.md)</div>
                <div className="text-[10px] text-gray-500">ສຳລັບ Notion / Docs</div>
              </div>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="p-3 rounded-xl border border-[#262626] bg-[#161616] hover:border-indigo-500/50 hover:bg-[#1c1c1c] text-left transition-colors flex items-center gap-2.5"
            >
              <Printer className="w-4 h-4 text-gray-400" />
              <div>
                <div className="text-xs font-semibold text-gray-200">ພິມ / PDF</div>
                <div className="text-[10px] text-gray-500">Print / Save as PDF</div>
              </div>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#141414] border-t border-[#222] flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>ລະບົບຮອງຮັບຟອນພາສາລາວ (Noto Sans Lao & Saysettha OT)</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-gray-400 hover:text-white font-medium"
          >
            ປິດໜ້າຕ່າງ
          </button>
        </div>
      </div>
    </div>
  );
};
