import React from 'react';
import { Question } from '../types';

interface QuestionBlockProps {
  question: Question;
  selectedOptionIndex: number | undefined;
  onSelectOption: (questionId: number, optionIndex: number) => void;
  showResult: boolean;
}

const QuestionBlock: React.FC<QuestionBlockProps> = ({ 
  question, 
  selectedOptionIndex, 
  onSelectOption,
  showResult 
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-6 transition-all">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-start">
        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded mt-1 mr-3">
          Q{question.id}
        </span>
        {question.questionText}
      </h3>

      <div className="space-y-3">
        {question.options.map((option, idx) => {
          let optionClass = "border-slate-200 hover:bg-slate-50 hover:border-blue-300";
          let icon = null;

          if (showResult) {
            if (idx === question.correctAnswerIndex) {
              optionClass = "bg-green-50 border-green-500 ring-1 ring-green-500";
              icon = <svg className="w-5 h-5 text-green-600 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
            } else if (idx === selectedOptionIndex && idx !== question.correctAnswerIndex) {
              optionClass = "bg-red-50 border-red-500 ring-1 ring-red-500";
              icon = <svg className="w-5 h-5 text-red-600 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
            } else {
              optionClass = "opacity-60 border-slate-100";
            }
          } else if (selectedOptionIndex === idx) {
            optionClass = "bg-blue-50 border-blue-600 ring-1 ring-blue-600 shadow-sm";
          }

          return (
            <div
              key={idx}
              onClick={() => !showResult && onSelectOption(question.id, idx)}
              className={`
                flex items-center p-4 rounded-lg border cursor-pointer transition-all duration-200
                ${optionClass}
              `}
            >
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mr-4 flex-shrink-0
                ${selectedOptionIndex === idx || (showResult && idx === question.correctAnswerIndex) ? 'bg-white text-slate-900 border border-slate-200' : 'bg-slate-100 text-slate-500'}
              `}>
                {option.label}
              </div>
              <span className="text-slate-700 flex-grow">{option.text}</span>
              {icon}
            </div>
          );
        })}
      </div>

      {showResult && (
        <div className="mt-4 p-4 bg-blue-50 rounded-md border border-blue-100 text-sm text-blue-800">
          <p className="font-semibold mb-1">Explanation:</p>
          {question.explanation}
        </div>
      )}
    </div>
  );
};

export default QuestionBlock;