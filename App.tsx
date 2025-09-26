import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header.tsx';
import ComplianceForm, { FormState } from './components/ComplianceForm.tsx';
import ResultsDisplay from './components/ResultsDisplay.tsx';
import Instructions from './components/Instructions.tsx';
import { reviewContent, generateContent } from './services/geminiService.ts';
import { ReviewResult, Workflow } from './types.ts';

const App: React.FC = () => {
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow>(Workflow.REVIEW);
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme) return storedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  const handleFormSubmit = useCallback(async (data: FormState) => {
    const { apiKey, content, standard, workflow, region } = data;

    if (!apiKey.trim()) {
        setError('Gemini API Key cannot be empty.');
        return;
    }
    if (!content.trim()) {
      setError('Content/Prompt cannot be empty.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);
    setGeneratedContent(null);
    setCurrentWorkflow(workflow);

    try {
      if (workflow === Workflow.REVIEW) {
        const reviewResult = await reviewContent(apiKey, content, standard, region);
        setResult(reviewResult);
      } else if (workflow === Workflow.GENERATE) {
        const newContent = await generateContent(apiKey, content, standard, region);
        setGeneratedContent(newContent);
      } else if (workflow === Workflow.REVIEW_AND_GENERATE) {
        const newContent = await generateContent(apiKey, content, standard, region);
        setGeneratedContent(newContent);
        const reviewResult = await reviewContent(apiKey, newContent, standard, region);
        setResult(reviewResult);
      }
    } catch (e: unknown) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Operation failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-200 transition-colors duration-300">
      <Header isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Instructions />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <ComplianceForm onFormSubmit={handleFormSubmit} isLoading={isLoading} />
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 min-h-[400px]">
              <ResultsDisplay 
                result={result} 
                isLoading={isLoading} 
                error={error} 
                generatedContent={generatedContent}
                workflow={currentWorkflow}
              />
            </div>
          </div>
        </div>
        <footer className="text-center mt-12 text-gray-500 dark:text-gray-400 text-sm">
          <p>Powered by Google Gemini. For informational purposes only. Not legal advice.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;