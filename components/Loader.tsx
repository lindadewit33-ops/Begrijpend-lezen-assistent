import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-xl shadow-lg border border-slate-200">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-brand-blue mb-4" role="status" aria-label="Laden"></div>
      <h2 className="text-xl font-semibold text-slate-700">Even geduld...</h2>
      <p className="text-slate-500">De tekst en vragen worden voor je gemaakt.</p>
    </div>
  );
};

export default Loader;
