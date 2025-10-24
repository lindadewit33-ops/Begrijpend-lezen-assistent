import React, { useState } from 'react';
import type { GeneratedContent, Question } from '../types';
import { PrintIcon } from './icons';

interface ResultDisplayProps {
  content: GeneratedContent;
  onReset: () => void;
}

const QuestionItem: React.FC<{ question: Question; index: number }> = ({ question, index }) => {
    const [showAnswer, setShowAnswer] = useState(false);
    const options = Object.entries(question.options);

    return (
        <div className="py-4 border-b border-slate-200 last:border-b-0">
            <p className="font-semibold text-slate-800 mb-3" id={`question-${index}`}>
                {index + 1}. {question.question}
            </p>
            <div role="radiogroup" aria-labelledby={`question-${index}`} className="space-y-2 mb-4">
                {options.map(([key, value]) => (
                    <div key={key} className={`p-3 rounded-lg border transition-colors ${
                        showAnswer && key === question.answer
                        ? 'bg-green-100 border-green-300 text-green-800 font-semibold'
                        : 'bg-slate-50 border-slate-200'
                    }`}>
                        <span className="font-bold">{key}:</span> {value}
                    </div>
                ))}
            </div>
            {!showAnswer ? (
                <button
                    onClick={() => setShowAnswer(true)}
                    className="text-sm font-semibold text-brand-blue hover:underline print:hidden"
                    aria-controls={`answer-${index}`}
                >
                    Toon antwoord
                </button>
            ) : (
                <p id={`answer-${index}`} className="text-sm font-bold text-slate-600 print:hidden">
                    Correct antwoord: <span className="text-green-700">{question.answer}</span>
                </p>
            )}
        </div>
    );
};

const ResultDisplay: React.FC<ResultDisplayProps> = ({ content, onReset }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-slate-200 animate-fade-in print:shadow-none print:border-none">
      <article>
        <h2 className="text-2xl sm:text-3xl font-bold text-brand-dark mb-4 pb-2 border-b-2 border-brand-lightblue">
          {content.title}
        </h2>
        <div className="text-slate-700 whitespace-pre-wrap leading-relaxed mb-8 prose">
          {content.text}
        </div>
      </article>

      <section>
        <h3 className="text-xl sm:text-2xl font-bold text-brand-dark mb-4">
          Vragen
        </h3>
        <div className="divide-y divide-slate-200">
          {content.questions.map((q, index) => (
            <QuestionItem key={index} question={q} index={index} />
          ))}
        </div>
      </section>
      
      <div className="mt-8 flex flex-col sm:flex-row-reverse justify-center items-center gap-4 print:hidden">
        <button
          onClick={onReset}
          className="w-full sm:w-auto px-6 py-3 bg-brand-blue text-white font-semibold rounded-lg shadow-md hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-colors"
        >
          Nieuwe tekst genereren
        </button>
        <button
          onClick={handlePrint}
          className="w-full sm:w-auto flex justify-center items-center gap-2 px-6 py-3 bg-slate-600 text-white font-semibold rounded-lg shadow-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
        >
          <PrintIcon className="w-5 h-5" />
          Print
        </button>
      </div>
    </div>
  );
};

export default ResultDisplay;