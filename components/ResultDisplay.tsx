import React, { useState } from 'react';
import type { GeneratedContent, Question } from '../types';
import { PrintIcon, KeyIcon, DownloadIcon } from './icons';

declare var docx: any;

interface ResultDisplayProps {
  content: GeneratedContent;
  onReset: () => void;
}

const QuestionItem: React.FC<{ question: Question; index: number }> = ({ question, index }) => {
    const options = Object.entries(question.options);

    return (
        <div className="py-4 border-b border-slate-200 last:border-b-0">
            <p className="font-semibold text-slate-800 mb-3" id={`question-${index}`}>
                {index + 1}. {question.question}
            </p>
            <div role="radiogroup" aria-labelledby={`question-${index}`} className="space-y-2 mb-4">
                {options.map(([key, value]) => (
                    <div key={key} className="p-3 rounded-lg border bg-slate-50 border-slate-200">
                        <span className="font-bold">{key}:</span> {value}
                    </div>
                ))}
            </div>
        </div>
    );
};

const ResultDisplay: React.FC<ResultDisplayProps> = ({ content, onReset }) => {
  const [showAnswerSheet, setShowAnswerSheet] = useState(false);
  
  const handlePrint = () => {
    window.print();
  };

  const checkDocxLibrary = () => {
    if (typeof docx === 'undefined') {
      alert('De download-functionaliteit is nog aan het laden. Probeer het over een paar seconden opnieuw.');
      console.error('docx library not loaded.');
      return false;
    }
    return true;
  };

  const downloadDocx = async (doc: any, fileName: string) => {
    const packer = new docx.Packer();
    const blob = await packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadWorksheet = async () => {
    if (!checkDocxLibrary()) return;
      
    const { Document, Paragraph, TextRun, HeadingLevel } = docx;
    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({ 
            children: [new TextRun(content.title)],
            heading: HeadingLevel.HEADING_1 
          }),
          new Paragraph({}),
          ...content.text.split('\n').filter(p => p.trim() !== '').map(p => new Paragraph({ children: [new TextRun(p.trim())] })),
          new Paragraph({}),
          new Paragraph({ 
            children: [new TextRun("Vragen")],
            heading: HeadingLevel.HEADING_2 
          }),
          new Paragraph({}),
          ...content.questions.flatMap((q, index) => [
            new Paragraph({
              children: [
                new TextRun({ text: `${index + 1}. `, bold: true }),
                new TextRun({ text: q.question }),
              ],
            }),
            new Paragraph({ children: [new TextRun(`A. ${q.options.A}`)], indent: { left: 720 } }),
            new Paragraph({ children: [new TextRun(`B. ${q.options.B}`)], indent: { left: 720 } }),
            new Paragraph({ children: [new TextRun(`C. ${q.options.C}`)], indent: { left: 720 } }),
            new Paragraph({ children: [new TextRun(`D. ${q.options.D}`)], indent: { left: 720 } }),
            new Paragraph({}),
          ]),
        ],
      }],
    });

    downloadDocx(doc, `${content.title.replace(/\s/g, '_')}_werkblad.docx`);
  };

  const handleDownloadAnswers = async () => {
    if (!checkDocxLibrary()) return;

    const { Document, Paragraph, TextRun, HeadingLevel } = docx;
    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({ 
            children: [new TextRun(`Antwoordblad: ${content.title}`)],
            heading: HeadingLevel.HEADING_1 
          }),
          new Paragraph({}),
          ...content.questions.map((q, index) =>
            new Paragraph({
              children: [
                new TextRun({ text: `${index + 1}. `, bold: true }),
                new TextRun({ text: q.answer }),
              ],
            })
          ),
        ],
      }],
    });
    
    downloadDocx(doc, `${content.title.replace(/\s/g, '_')}_antwoorden.docx`);
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

      {showAnswerSheet && (
        <section className="mt-8 pt-6 border-t-2 border-dashed border-slate-300 animate-fade-in print:hidden">
          <h3 className="text-xl sm:text-2xl font-bold text-brand-dark mb-4">
            Antwoordblad
          </h3>
          <ol className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-slate-700">
            {content.questions.map((q, index) => (
              <li key={index} className="flex items-center gap-2 p-2 bg-slate-50 rounded-md">
                <span className="font-bold text-slate-800">{index + 1}.</span>
                <span className="font-semibold text-green-700">{q.answer}</span>
              </li>
            ))}
          </ol>
        </section>
      )}
      
      <div className="mt-8 flex flex-wrap justify-center gap-3 print:hidden">
        <button
          onClick={handleDownloadWorksheet}
          className="w-full sm:w-auto flex justify-center items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
        >
          <DownloadIcon className="w-5 h-5" />
          Download Werkblad
        </button>
        <button
          onClick={handleDownloadAnswers}
          className="w-full sm:w-auto flex justify-center items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
        >
          <DownloadIcon className="w-5 h-5" />
          Download Antwoorden
        </button>
        <button
          onClick={handlePrint}
          className="w-full sm:w-auto flex justify-center items-center gap-2 px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg shadow-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
        >
          <PrintIcon className="w-5 h-5" />
          Print
        </button>
        <button
          onClick={() => setShowAnswerSheet(!showAnswerSheet)}
          className="w-full sm:w-auto flex justify-center items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg shadow-md hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition-colors"
          aria-expanded={showAnswerSheet}
        >
          <KeyIcon className="w-5 h-5" />
          {showAnswerSheet ? 'Verberg Antwoordblad' : 'Toon Antwoordblad'}
        </button>
        <button
          onClick={onReset}
          className="w-full sm:w-auto px-6 py-3 bg-brand-blue text-white font-semibold rounded-lg shadow-md hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-colors"
        >
          Nieuwe tekst genereren
        </button>
      </div>
    </div>
  );
};

export default ResultDisplay;