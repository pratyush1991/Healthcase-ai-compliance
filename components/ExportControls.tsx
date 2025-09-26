import React, { useState, useCallback, useRef, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { ReviewResult, Workflow } from '../types.ts';
import DownloadIcon from './icons/DownloadIcon.tsx';
import CheckCircleIcon from './icons/CheckCircleIcon.tsx';
import ChevronDownIcon from './icons/ChevronDownIcon.tsx';

interface ExportControlsProps {
  result: ReviewResult | null;
  generatedContent: string | null;
  workflow: Workflow;
}

const ExportControls: React.FC<ExportControlsProps> = ({ result, generatedContent, workflow }) => {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatReviewAsText = useCallback((review: ReviewResult): string => {
    let report = `Compliance Review Summary\n`;
    report += `=========================\n\n`;
    report += `Overall Status: ${review.isCompliant ? 'Compliant' : 'Issues Found'}\n`;
    report += `Summary: ${review.summary}\n\n`;

    if (review.issues.length > 0) {
      report += `Identified Issues (${review.issues.length})\n`;
      report += `----------------------\n\n`;
      review.issues.forEach((issue, index) => {
        report += `${index + 1}. Issue: ${issue.issue} (Severity: ${issue.severity})\n`;
        report += `   Original Text: "${issue.originalText}"\n`;
        report += `   Explanation: ${issue.explanation}\n`;
        report += `   Suggestion: ${issue.suggestion}\n\n`;
      });
    }
    return report;
  }, []);

  const getExportData = useCallback(() => {
    let textParts: string[] = [];
    let json: object | string = {};
    
    if (workflow === Workflow.GENERATE) {
      if (generatedContent) {
        textParts.push('Generated Content\n=================\n\n' + generatedContent);
        json = { generatedContent };
      }
    } else if (workflow === Workflow.REVIEW) {
      if (result) {
        textParts.push(formatReviewAsText(result));
        json = { reviewResult: result };
      }
    } else if (workflow === Workflow.REVIEW_AND_GENERATE) {
      if (generatedContent) textParts.push('Generated Content\n=================\n\n' + generatedContent);
      if (result) textParts.push(formatReviewAsText(result));
      json = { generatedContent, reviewResult: result };
    }
    
    const text = textParts.join('\n\n-----------------\n\n');
    return { text, json };
  }, [result, generatedContent, workflow, formatReviewAsText]);

  const handleDownload = (format: 'txt' | 'json') => {
    setIsOpen(false);
    const { text, json } = getExportData();
    const content = format === 'txt' ? text : JSON.stringify(json, null, 2);
    const blob = new Blob([content], { type: format === 'txt' ? 'text/plain' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compliance-report.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = () => {
    setIsOpen(false);
    const { text } = getExportData();
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(text, 180); // 180mm width
    doc.setFontSize(11);
    doc.text(lines, 15, 20);
    doc.save('compliance-report.pdf');
  };

  const handleDownloadDocx = () => {
    setIsOpen(false);
    const { text } = getExportData();
    
    const paragraphs = text.split('\n').map(line => {
        if (line.match(/^={2,}/) || line.match(/^-{2,}/)) return null;
        if (line.match(/^(Compliance Review Summary|Generated Content|Identified Issues)/)) {
            return new Paragraph({
                children: [new TextRun({ text: line, bold: true, size: 28 })], // 14pt
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 240, after: 120 },
            });
        }
        return new Paragraph({ children: [new TextRun({ text: line, size: 22 })]}); // 11pt
    }).filter(p => p !== null) as Paragraph[];

    const doc = new Document({ sections: [{ children: paragraphs }] });

    Packer.toBlob(doc).then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'compliance-report.docx';
        a.click();
        URL.revokeObjectURL(url);
    });
  };

  const handleCopy = () => {
    setIsOpen(false);
    const { text } = getExportData();
    navigator.clipboard.writeText(text).then(() => {
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    });
  };

  const menuItems = [
    { label: 'Download as .docx', action: handleDownloadDocx, icon: <DownloadIcon className="w-4 h-4" /> },
    { label: 'Download as .pdf', action: handleDownloadPdf, icon: <DownloadIcon className="w-4 h-4" /> },
    { label: 'Download as .txt', action: () => handleDownload('txt'), icon: <DownloadIcon className="w-4 h-4" /> },
    { label: 'Download as .json', action: () => handleDownload('json'), icon: <DownloadIcon className="w-4 h-4" /> },
  ];

  return (
    <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600/50 flex items-center justify-between">
      <h4 className="text-md font-semibold text-gray-700 dark:text-gray-200">Export Results</h4>
      <div className="flex items-center gap-3">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 font-medium py-2 px-3 rounded-lg border border-gray-300 dark:border-gray-600 transition"
        >
          {copyStatus === 'copied' ? (
            <>
              <CheckCircleIcon className="w-5 h-5 text-green-600" />
              Copied!
            </>
          ) : (
            'Copy to Clipboard'
          )}
        </button>
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 font-medium py-2 px-3 rounded-lg border border-indigo-700 transition"
            >
                Download
                <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 z-10 animate-fade-in-fast">
                    <ul className="py-1">
                        {menuItems.map(({label, action, icon}) => (
                             <li key={label}>
                                <a href="#" onClick={(e) => { e.preventDefault(); action(); }} className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                                   <span className="mr-3 text-gray-500 dark:text-gray-400">{icon}</span>
                                   {label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ExportControls;