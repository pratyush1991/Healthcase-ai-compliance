import React from 'react';
import { ReviewResult, SeverityLevel, Workflow } from '../types.ts';
import Spinner from './Spinner.tsx';
import CheckCircleIcon from './icons/CheckCircleIcon.tsx';
import ExclamationTriangleIcon from './icons/ExclamationTriangleIcon.tsx';
import ExportControls from './ExportControls.tsx';

interface ResultsDisplayProps {
  result: ReviewResult | null;
  isLoading: boolean;
  error: string | null;
  generatedContent: string | null;
  workflow: Workflow;
}

const SEVERITY_STYLES: Record<SeverityLevel, { container: string; title: string; risk: string; quote: string; explanation: string; suggestion: string }> = {
    High: { 
        container: 'border-red-500 dark:border-red-600 bg-red-50 dark:bg-red-900/40',
        title: 'text-red-800 dark:text-red-200',
        risk: 'bg-red-100 dark:bg-red-800/50 text-red-800 dark:text-red-200',
        quote: 'border-red-500/50 dark:border-red-600/50 text-red-800 dark:text-red-200',
        explanation: 'text-red-800 dark:text-red-200',
        suggestion: 'bg-green-100 dark:bg-green-900/60 text-green-900 dark:text-green-100'
    },
    Medium: { 
        container: 'border-yellow-500 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/40',
        title: 'text-yellow-800 dark:text-yellow-200',
        risk: 'bg-yellow-100 dark:bg-yellow-800/50 text-yellow-800 dark:text-yellow-200',
        quote: 'border-yellow-500/50 dark:border-yellow-600/50 text-yellow-800 dark:text-yellow-200',
        explanation: 'text-yellow-800 dark:text-yellow-200',
        suggestion: 'bg-green-100 dark:bg-green-900/60 text-green-900 dark:text-green-100'
    },
    Low: { 
        container: 'border-blue-500 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/40',
        title: 'text-blue-800 dark:text-blue-200',
        risk: 'bg-blue-100 dark:bg-blue-800/50 text-blue-800 dark:text-blue-200',
        quote: 'border-blue-500/50 dark:border-blue-600/50 text-blue-800 dark:text-blue-200',
        explanation: 'text-blue-800 dark:text-blue-200',
        suggestion: 'bg-green-100 dark:bg-green-900/60 text-green-900 dark:text-green-100'
    },
};

const InitialState: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full text-center">
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">AI Results Panel</h3>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Your analysis or generated content will appear here.</p>
    </div>
);

const GeneratedContentDisplay: React.FC<{content: string}> = ({ content }) => (
    <div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">Generated Content</h3>
        <div className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg prose prose-sm dark:prose-invert max-w-none max-h-[600px] overflow-y-auto">
            <p className="whitespace-pre-wrap">{content}</p>
        </div>
    </div>
);

const ReviewReport: React.FC<{result: ReviewResult}> = ({ result }) => (
    <>
        <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Analysis Summary</h3>
            <div className={`flex items-start p-4 rounded-lg ${result.isCompliant ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200' : 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200'}`}>
                {result.isCompliant ? <CheckCircleIcon className="w-6 h-6 mr-3 flex-shrink-0" /> : <ExclamationTriangleIcon className="w-6 h-6 mr-3 flex-shrink-0" />}
                <p className="font-medium">{result.summary}</p>
            </div>
        </div>
        
        {result.issues.length > 0 && (
            <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">Identified Issues ({result.issues.length})</h3>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {result.issues.map((issue, index) => {
                const styles = SEVERITY_STYLES[issue.severity] || SEVERITY_STYLES.Low;
                return (
                    <div key={index} className={`border-l-4 p-4 rounded-r-lg ${styles.container}`}>
                    <div className="flex justify-between items-center">
                        <h4 className={`text-lg font-bold ${styles.title}`}>{issue.issue}</h4>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles.risk}`}>
                        {issue.severity} Risk
                        </span>
                    </div>
                    <p className={`mt-2 text-sm italic border-l-2 pl-2 ${styles.quote}`}>
                        "{issue.originalText}"
                    </p>
                    <div className="mt-4">
                        <p className={`font-semibold ${styles.title}`}>Explanation:</p>
                        <p className={`text-sm ${styles.explanation}`}>{issue.explanation}</p>
                    </div>
                    <div className="mt-3">
                        <p className={`font-semibold ${styles.title}`}>Suggestion:</p>
                        <p className={`text-sm p-2 rounded ${styles.suggestion}`}>{issue.suggestion}</p>
                    </div>
                    </div>
                );
                })}
            </div>
            </div>
        )}
    </>
);


const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, isLoading, error, generatedContent, workflow }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <Spinner size="lg" />
        <p className="text-gray-600 dark:text-gray-300 font-medium">AI is processing...</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm">This may take a few moments.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center bg-red-50 dark:bg-red-900/40 p-6 rounded-lg">
        <ExclamationTriangleIcon className="w-12 h-12 text-red-500 dark:text-red-400" />
        <h3 className="mt-4 text-lg font-semibold text-red-800 dark:text-red-200">An Error Occurred</h3>
        <p className="mt-1 text-red-700 dark:text-red-300">{error}</p>
      </div>
    );
  }

  const hasContent = result || generatedContent;

  if (!hasContent) {
    return <InitialState />;
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
        {generatedContent && <GeneratedContentDisplay content={generatedContent} />}
        {result && <ReviewReport result={result} />}
        {hasContent && (
          <ExportControls
            result={result}
            generatedContent={generatedContent}
            workflow={workflow}
          />
        )}
    </div>
  );
};

export default ResultsDisplay;