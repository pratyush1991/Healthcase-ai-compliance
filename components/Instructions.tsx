import React from 'react';
import KeyIcon from './icons/KeyIcon.tsx';
import DocumentTextIcon from './icons/DocumentTextIcon.tsx';
import EyeIcon from './icons/EyeIcon.tsx';

const Instructions: React.FC = () => {
  return (
    <div className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center mb-6">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="flex flex-col items-center p-4">
          <div className="bg-indigo-100 dark:bg-indigo-900/50 p-4 rounded-full mb-3">
            <KeyIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="font-semibold text-gray-700 dark:text-gray-200">1. Configure Your Review</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Enter your Gemini API key, then select a workflow, region, and compliance standard.</p>
        </div>
        <div className="flex flex-col items-center p-4">
          <div className="bg-indigo-100 dark:bg-indigo-900/50 p-4 rounded-full mb-3">
            <DocumentTextIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="font-semibold text-gray-700 dark:text-gray-200">2. Provide Content</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Type, paste, or upload the content you want to analyze or use as a basis for generation.</p>
        </div>
        <div className="flex flex-col items-center p-4">
          <div className="bg-indigo-100 dark:bg-indigo-900/50 p-4 rounded-full mb-3">
            <EyeIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="font-semibold text-gray-700 dark:text-gray-200">3. Get AI Analysis</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Receive a detailed compliance report, generated content, or both.</p>
        </div>
      </div>
    </div>
  );
};

export default Instructions;