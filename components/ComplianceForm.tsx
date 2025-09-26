import React, { useState, useCallback, useRef } from 'react';
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import { ComplianceStandard, Workflow, Region } from '../types.ts';
import { COMPLIANCE_OPTIONS, WORKFLOW_OPTIONS, REGION_OPTIONS, DEMO_CONTENT } from '../constants.ts';
import Spinner from './Spinner.tsx';
import UploadIcon from './icons/UploadIcon.tsx';
import DocumentTextIcon from './icons/DocumentTextIcon.tsx';
import KeyIcon from './icons/KeyIcon.tsx';

// Configure the worker for pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@4.4.168/build/pdf.worker.mjs`;

export interface FormState {
  apiKey: string;
  content: string;
  standard: ComplianceStandard;
  workflow: Workflow;
  region: Region;
}

interface ComplianceFormProps {
  onFormSubmit: (data: FormState) => void;
  isLoading: boolean;
}

const ComplianceForm: React.FC<ComplianceFormProps> = ({ onFormSubmit, isLoading }) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [standard, setStandard] = useState<ComplianceStandard>(ComplianceStandard.FDA_MARKETING);
  const [workflow, setWorkflow] = useState<Workflow>(Workflow.REVIEW);
  const [region, setRegion] = useState<Region>(Region.USA);
  const [content, setContent] = useState<string>(DEMO_CONTENT[standard]);
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStandardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStandard = e.target.value as ComplianceStandard;
    setStandard(newStandard);
    setContent(DEMO_CONTENT[newStandard] || '');
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    setParseError(null);
    setContent(''); // Clear previous content while parsing

    try {
      let text = '';
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (fileExtension === 'txt') {
        text = await file.text();
      } else if (fileExtension === 'docx') {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      } else if (fileExtension === 'pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const numPages = pdf.numPages;
        const pageTexts = [];
        for (let i = 1; i <= numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => 'str' in item ? item.str : '').join(' ');
          pageTexts.push(pageText);
        }
        text = pageTexts.join('\n\n');
      } else {
        throw new Error(`Unsupported file type: .${fileExtension}. Please use .txt, .docx, or .pdf.`);
      }
      setContent(text);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      console.error("Error parsing file:", e);
      setParseError(`Failed to read file. ${errorMessage}`);
    } finally {
      setIsParsing(false);
      // Reset file input value to allow re-uploading the same file
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFormSubmit({ apiKey, content, standard, workflow, region });
  };
  
  const isGenerate = workflow === Workflow.GENERATE || workflow === Workflow.REVIEW_AND_GENERATE;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Configuration</h2>
      
      <div>
        <label htmlFor="api-key" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gemini API Key</label>
        <div className="relative">
            <KeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
                type="password"
                id="api-key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your Gemini API Key"
            />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="workflow" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Workflow</label>
          <select id="workflow" value={workflow} onChange={(e) => setWorkflow(e.target.value as Workflow)} className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            {WORKFLOW_OPTIONS.map(option => <option key={option.id} value={option.id}>{option.label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="region" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Region</label>
          <select id="region" value={region} onChange={(e) => setRegion(e.target.value as Region)} className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            {REGION_OPTIONS.map(option => <option key={option.id} value={option.id}>{option.label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="standard" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Compliance Standard</label>
          <select id="standard" value={standard} onChange={handleStandardChange} className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            {COMPLIANCE_OPTIONS.map(option => <option key={option.id} value={option.id}>{option.label}</option>)}
          </select>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          <label htmlFor="content">{isGenerate ? 'Content Prompt' : 'Content to Review'}</label>
          <div>
            <button type="button" onClick={handleUploadClick} disabled={isParsing} className="flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:underline disabled:opacity-50 disabled:cursor-wait">
              <UploadIcon className="w-4 h-4" />
              {isParsing ? 'Parsing...' : 'Upload File'}
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".txt,.docx,.pdf" className="hidden" />
          </div>
        </div>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder={isGenerate ? 'e.g., "Write a marketing email for a new heart rate monitor."' : 'Enter content for compliance review, or upload a .txt, .docx, or .pdf file.'}
        />
        {parseError && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{parseError}</p>}
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading || isParsing}
          className="w-full flex items-center justify-center bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? <Spinner size="sm" onAccent className="mr-2" /> : <DocumentTextIcon className="w-5 h-5 mr-2" />}
          {isLoading ? 'Processing...' : (workflow === Workflow.GENERATE ? 'Generate' : 'Review')}
        </button>
      </div>
    </form>
  );
};

export default ComplianceForm;