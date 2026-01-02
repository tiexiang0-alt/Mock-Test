import React, { useState, useEffect } from 'react';

const NotePad: React.FC = () => {
  const [note, setNote] = useState('');

  // Persist notes to local storage so they don't vanish on re-render if we were to unmount
  // (Though in this app structure, we might keep it mounted)
  useEffect(() => {
      const saved = localStorage.getItem('toefl_notes');
      if (saved) setNote(saved);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value;
      setNote(val);
      localStorage.setItem('toefl_notes', val);
  };

  return (
    <div className="bg-yellow-50 rounded-lg border border-yellow-200 shadow-sm p-4 h-full flex flex-col">
       <div className="flex justify-between items-center mb-2">
         <h3 className="text-sm font-bold text-yellow-800 uppercase tracking-wide flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
            </svg>
            Scratchpad
         </h3>
         <button onClick={() => {setNote(''); localStorage.setItem('toefl_notes', '');}} className="text-xs text-yellow-600 hover:text-yellow-800 underline">Clear</button>
       </div>
       <textarea
         className="flex-grow w-full bg-transparent resize-none focus:outline-none text-slate-700 text-sm font-mono leading-relaxed placeholder-yellow-300"
         placeholder="Type your notes here while listening..."
         value={note}
         onChange={handleChange}
         spellCheck={false}
       />
    </div>
  );
};

export default NotePad;