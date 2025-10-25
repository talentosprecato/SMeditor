import React, { useState, useCallback } from 'react';
import { CVInputForm } from './components/CVInputForm';
import { CVOutputDisplay } from './components/CVOutputDisplay';
import { Header } from './components/Header';
import { Loader } from './components/Loader';
import { editCVWithAI } from './services/geminiService';
import { SparklesIcon } from './components/icons';

const App: React.FC = () => {
  const [originalCV, setOriginalCV] = useState<string>('');
  const [jobTitle, setJobTitle] = useState<string>('');
  const [position, setPosition] = useState<string>('');
  const [editedCV, setEditedCV] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'it'>('en');

  const handleFileRead = (content: string) => {
    setOriginalCV(content);
  };

  const handleSubmit = useCallback(async () => {
    if (!originalCV || !jobTitle || !position) {
      setError('Please fill in all fields and provide your CV.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setEditedCV('');

    try {
      const result = await editCVWithAI(originalCV, jobTitle, position, language);
      setEditedCV(result);
    } catch (e) {
      console.error(e);
      setError('An error occurred while enhancing your CV. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [originalCV, jobTitle, position, language]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <CVInputForm
            originalCV={originalCV}
            setOriginalCV={setOriginalCV}
            jobTitle={jobTitle}
            setJobTitle={setJobTitle}
            position={position}
            setPosition={setPosition}
            language={language}
            setLanguage={setLanguage}
            onFileRead={handleFileRead}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />

          {isLoading && (
            <div className="mt-8 flex flex-col items-center justify-center text-center">
              <Loader />
              <p className="mt-4 text-lg font-medium text-primary-600">
                Our AI is working its magic...
              </p>
              <p className="text-gray-500">Crafting your professional story.</p>
            </div>
          )}

          {error && (
            <div className="mt-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}

          {!isLoading && editedCV && (
             <div className="mt-12">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-2 flex items-center justify-center gap-2">
                    <SparklesIcon className="w-8 h-8 text-primary-500" />
                    Your Enhanced CV
                </h2>
                <p className="text-center text-gray-500 mb-8">Compare your original CV with the AI-powered version.</p>
                <CVOutputDisplay originalCV={originalCV} editedCV={editedCV} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;