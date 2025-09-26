import React from 'react';
import DarkModeToggle from './DarkModeToggle.tsx';

const ShieldIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600 dark:text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 1.944c-1.664-1.263-4.14-1.263-5.804 0C2.535 3.418 1.95 5.86 3.197 7.97c1.47 2.58 4.32 4.408 6.336 5.694a1.2 1.2 0 001.034 0c2.016-1.286 4.866-3.114 6.336-5.694C18.05 5.86 17.465 3.418 15.804 1.944c-1.664-1.263-4.14-1.263-5.804 0zM10 18a8 8 0 100-16 8 8 0 000 16zm-.001-1.2a6.8 6.8 0 110-13.6 6.8 6.8 0 010 13.6zm-1.2-5.752a1 1 0 011.414 0l2.25 2.25a1 1 0 01-1.414 1.414L10 12.414l-1.043 1.043a1 1 0 01-1.414-1.414l2.25-2.25z" clipRule="evenodd" />
  </svg>
);

interface HeaderProps {
    isDarkMode: boolean;
    onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, onToggleTheme }) => {
  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <ShieldIcon />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Healthcare Compliance AI
          </h1>
        </div>
        <div className="flex items-center gap-4">
            <p className="hidden md:block text-gray-600 dark:text-gray-400">
                Content Review & Generation
            </p>
            <DarkModeToggle isDarkMode={isDarkMode} onToggle={onToggleTheme} />
        </div>
      </div>
    </header>
  );
};

export default Header;