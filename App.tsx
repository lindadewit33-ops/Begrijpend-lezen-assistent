import React, { useState } from 'react';
import type { FormData, GeneratedContent } from './types';
import { generateReadingComprehension } from './services/geminiService';
import InputForm from './components/InputForm';
import ResultDisplay from './components/ResultDisplay';
import Loader from './components/Loader';
import { BookIcon, SparklesIcon } from './components/icons';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);

  const handleGenerate = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);
    setGeneratedContent(null);
    try {
      const content = await generateReadingComprehension(formData);
      setGeneratedContent(content);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Er is een onbekende fout opgetreden.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setGeneratedContent(null);
    setError(null);
  };

  const renderContent = () => {
    if (isLoading) {
      return <Loader />;
    }
    if (error) {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
          <strong className="font-bold">Fout!</strong>
          <span className="block sm:inline ml-2">{error}</span>
           <button onClick={handleReset} className="absolute top-0 bottom-0 right-0 px-4 py-3">
             <span className="text-2xl">&times;</span>
          </button>
        </div>
      );
    }
    if (generatedContent) {
      return <ResultDisplay content={generatedContent} onReset={handleReset} />;
    }
    return (
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
              <SparklesIcon className="w-6 h-6 text-brand-blue" />
              <h2 className="text-xl font-semibold text-slate-700">Genereer een nieuwe leestekst</h2>
          </div>
          <p className="text-slate-600 mb-6">
              Vul de onderstaande velden in om een leestekst met vragen op maat te maken voor uw leerlingen.
          </p>
          <InputForm onGenerate={handleGenerate} isLoading={isLoading} />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans print:bg-white">
      <header className="bg-brand-blue shadow-md print:hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BookIcon className="h-8 w-8 text-white" />
            <h1 className="text-2xl font-bold text-white">
              Begrijpend Lezen Assistent
            </h1>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;