import React, { useState } from 'react';
import type { FormData } from '../types';
import { SparklesIcon } from './icons';

interface InputFormProps {
  onGenerate: (formData: FormData) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onGenerate, isLoading }) => {
  const [groupLevel, setGroupLevel] = useState('6');
  const [textLength, setTextLength] = useState('middel');
  const [numQuestions, setNumQuestions] = useState(3);
  const [subject, setSubject] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (subject.trim() === '') {
        alert('Vul alstublieft een onderwerp in.');
        return;
    }
    onGenerate({ groupLevel: `Groep ${groupLevel}`, textLength, numQuestions, subject });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="groupLevel" className="block text-sm font-medium text-slate-700 mb-1">
          Groepsniveau
        </label>
        <select
          id="groupLevel"
          value={groupLevel}
          onChange={(e) => setGroupLevel(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
          aria-label="Selecteer groepsniveau"
        >
          <option value="4">Groep 4</option>
          <option value="5">Groep 5</option>
          <option value="6">Groep 6</option>
          <option value="7">Groep 7</option>
          <option value="8">Groep 8</option>
        </select>
      </div>

      <div>
        <label htmlFor="textLength" className="block text-sm font-medium text-slate-700 mb-1">
          Lengte van de tekst
        </label>
        <select
          id="textLength"
          value={textLength}
          onChange={(e) => setTextLength(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
          aria-label="Selecteer tekstlengte"
        >
          <option value="kort">Kort (≈ 100-150 woorden)</option>
          <option value="middel">Middel (≈ 150-250 woorden)</option>
          <option value="lang">Lang (≈ 250-400 woorden)</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="numQuestions" className="block text-sm font-medium text-slate-700 mb-1">
          Aantal vragen
        </label>
        <input
          type="number"
          id="numQuestions"
          value={numQuestions}
          onChange={(e) => setNumQuestions(Math.max(1, parseInt(e.target.value, 10)))}
          min="1"
          max="10"
          className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
          aria-label="Voer het aantal vragen in"
        />
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">
          Onderwerp van de tekst
        </label>
        <input
          type="text"
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Bijv. vulkanen, de Romeinen, of vriendschap"
          className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
          required
          aria-required="true"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-brand-blue text-white font-semibold rounded-lg shadow-md hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
      >
        <SparklesIcon className="w-5 h-5" />
        {isLoading ? 'Bezig met genereren...' : 'Genereer tekst en vragen'}
      </button>
    </form>
  );
};

export default InputForm;
