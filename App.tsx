import React, { useState, useEffect, useRef } from 'react';
import { MODULE_1, MODULE_2_HARD, MODULE_2_EASY } from './constants';
import { TestState, Module, TestSegment } from './types';
import AudioPlayer from './components/AudioPlayer';
import QuestionBlock from './components/QuestionBlock';
import NotePad from './components/NotePad';

// Format time as MM:SS
const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

export default function App() {
  const [activeModule, setActiveModule] = useState<Module>(MODULE_1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const [testState, setTestState] = useState<TestState>({
    currentModuleId: MODULE_1.id,
    currentSegmentIndex: 0,
    answers: {},
    moduleScores: {}, // Store score per module
    isCompleted: false,
    pathTaken: null,
    startTime: Date.now()
  });
  
  const [showQuestions, setShowQuestions] = useState(false);
  const [transcriptVisible, setTranscriptVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(MODULE_1.timeLimitSeconds);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentSegment = activeModule.segments[testState.currentSegmentIndex];
  const isIntro = currentSegment.type === 'intro';

  // --- TIMER LOGIC (UPDATED: Pauses when not answering) ---
  useEffect(() => {
    // Timer should stop if: test complete, transitioning, intro segment, OR audio is playing (questions not yet shown)
    if (testState.isCompleted || isTransitioning || isIntro || !showQuestions) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleModuleComplete(); // Auto-advance if time runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testState.isCompleted, isTransitioning, isIntro, activeModule.id, showQuestions]);

  const handleAudioEnd = () => {
    if (!showQuestions && !isIntro) {
      setShowQuestions(true);
    }
  };

  const calculateModuleScore = (module: Module) => {
    let score = 0;
    let total = 0;
    module.segments.forEach(seg => {
      if(seg.type === 'intro') return;
      seg.questions.forEach(q => {
        total++;
        if (testState.answers[q.id] === q.correctAnswerIndex) {
          score++;
        }
      });
    });
    return { score, total, percentage: total === 0 ? 0 : (score/total) };
  };

  const handleModuleComplete = () => {
    // 1. Calculate Score for Current Module
    const { score, percentage } = calculateModuleScore(activeModule);
    
    const updatedScores = { ...testState.moduleScores, [activeModule.id]: score };
    
    if (activeModule.id === 'module-1') {
      // --- ROUTING LOGIC ---
      setIsTransitioning(true);
      
      setTimeout(() => {
        let nextModule = MODULE_2_EASY;
        let path: 'hard' | 'easy' = 'easy';
        
        // If score > 60%, route to Hard
        if (percentage >= 0.6) {
          nextModule = MODULE_2_HARD;
          path = 'hard';
        }

        setTestState(prev => ({
          ...prev,
          currentModuleId: nextModule.id,
          currentSegmentIndex: 0,
          moduleScores: updatedScores,
          pathTaken: path
        }));
        
        setActiveModule(nextModule);
        setTimeLeft(nextModule.timeLimitSeconds);
        setShowQuestions(false);
        setTranscriptVisible(false);
        setIsTransitioning(false);
        if (scrollContainerRef.current) scrollContainerRef.current.scrollTo(0,0);
      }, 3000); // 3s delay for "Calibrating..." effect
      
    } else {
      // Finish Test
      setTestState(prev => ({
        ...prev,
        moduleScores: updatedScores,
        isCompleted: true
      }));
      if (scrollContainerRef.current) scrollContainerRef.current.scrollTo(0,0);
    }
  };

  const handleNext = () => {
    if (testState.currentSegmentIndex < activeModule.segments.length - 1) {
      setTestState(prev => ({
        ...prev,
        currentSegmentIndex: prev.currentSegmentIndex + 1
      }));
      setShowQuestions(false);
      setTranscriptVisible(false);
      if (scrollContainerRef.current) scrollContainerRef.current.scrollTo(0,0);
    } else {
      handleModuleComplete();
    }
  };

  // Direct Jump to Review/Study Mode
  const handleJumpToReview = () => {
      // Load Hard module for full content review
      const reviewModule = MODULE_2_HARD;
      setActiveModule(reviewModule);
      
      setTestState(prev => ({
          ...prev,
          currentModuleId: reviewModule.id,
          pathTaken: 'hard', // Default to hard path for review to show advanced items
          isCompleted: true,
          // Zero scores since we are skipping
          moduleScores: { [MODULE_1.id]: 0, [reviewModule.id]: 0 }
      }));
      
      if (scrollContainerRef.current) scrollContainerRef.current.scrollTo(0,0);
  };

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    setTestState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: optionIndex
      }
    }));
  };

  // Scroll handler for review navigation
  const scrollToReviewItem = (segmentId: string) => {
    const element = document.getElementById(`review-${segmentId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // --- TRANSITION SCREEN ---
  if (isTransitioning) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white font-sans">
        <div className="animate-pulse flex flex-col items-center">
           <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
           <h2 className="text-2xl font-bold mb-2">Calibrating Difficulty...</h2>
           <p className="text-slate-400">Analyzing Module 1 performance to route your next path.</p>
        </div>
      </div>
    );
  }

  // --- RESULTS SCREEN (NEW CEFR BAND & ANSWER KEY) ---
  if (testState.isCompleted) {
    const m1Data = calculateModuleScore(MODULE_1);
    const m2Data = calculateModuleScore(activeModule);
    const totalScore = testState.moduleScores['module-1'] + testState.moduleScores[activeModule.id];
    const totalMax = m1Data.total + m2Data.total;
    
    // Estimate CEFR Band
    let cefrBand = "A2"; 
    let scoreBand = "1.0 - 2.5";
    const totalPct = totalScore / totalMax;
    
    // Logic for skipped test (0 score)
    if (totalScore === 0 && Object.keys(testState.answers).length === 0) {
        cefrBand = "Review";
        scoreBand = "Practice Mode";
    } else {
        if (testState.pathTaken === 'hard') {
            if (totalPct > 0.85) { cefrBand = "C1/C2"; scoreBand = "5.5 - 6.0"; }
            else if (totalPct > 0.6) { cefrBand = "B2"; scoreBand = "4.5 - 5.0"; }
            else { cefrBand = "B1"; scoreBand = "3.5 - 4.0"; }
        } else {
            if (totalPct > 0.8) { cefrBand = "B1"; scoreBand = "3.5 - 4.0"; }
            else { cefrBand = "A2"; scoreBand = "1.0 - 3.0"; }
        }
    }
    
    const legacyScore = Math.round(totalPct * 30);
    
    // Combine segments for review (excluding intro)
    const reviewSegments = [...MODULE_1.segments, ...activeModule.segments].filter(s => s.type !== 'intro');

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
         {/* Results Header */}
         <header className="bg-slate-900 text-white shadow-md h-16 flex-shrink-0 z-20 sticky top-0 px-6 flex items-center justify-between">
            <h1 className="font-bold text-lg">Test Results / Analysis</h1>
            <button onClick={() => window.location.reload()} className="text-sm bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded font-semibold transition">
                Start New Test
            </button>
         </header>

         {/* Scrollable Content */}
         <div className="flex-grow overflow-y-auto scroll-smooth p-6 md:p-10" ref={scrollContainerRef}>
            <div className="max-w-4xl mx-auto">
                {/* Score Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mb-8">
                    <div className="bg-slate-900 text-white p-8 text-center">
                        <h1 className="text-3xl font-bold mb-2">Assessment Report</h1>
                        <p className="opacity-80">2026 Format - Adaptive</p>
                    </div>
                    
                    <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
                        <div className="py-4">
                            <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-2">Band / Level</p>
                            <div className="text-4xl lg:text-5xl font-extrabold text-blue-600 mb-2">{scoreBand}</div>
                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-bold">{cefrBand}</span>
                        </div>
                        <div className="py-4">
                            <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-2">Score</p>
                            <div className="text-5xl font-extrabold text-slate-700 mb-2">{legacyScore}<span className="text-2xl text-slate-400">/30</span></div>
                            <p className="text-xs text-slate-400">Legacy Scale</p>
                        </div>
                        <div className="py-4">
                            <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-2">Path Taken</p>
                            <div className="text-2xl font-bold text-slate-800 mb-2 capitalize">
                                {testState.pathTaken === 'hard' ? 'Advanced Module' : 'Standard Module'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Jump Navigation */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-12 sticky top-4 z-10 ring-1 ring-slate-900/5">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                        Jump to Analysis
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {reviewSegments.map((segment, idx) => {
                        // Check if all questions in this segment were correct
                        // If answers are empty (skipped test), it's considered "not correct" but we can style differently if needed.
                        // For now, red is fine for unattempted.
                        const allCorrect = segment.questions.length > 0 && segment.questions.every(q => testState.answers[q.id] === q.correctAnswerIndex);
                        
                        return (
                            <button 
                                key={segment.id}
                                onClick={() => scrollToReviewItem(segment.id)}
                                className={`
                                    text-xs font-medium px-3 py-2 rounded transition-all text-center truncate border
                                    ${allCorrect 
                                        ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}
                                `}
                                title={segment.title}
                            >
                                <span className="font-bold mr-1">{idx + 1}.</span> 
                                {segment.title.replace("Listen and Choose (Item ", "Item ").replace("Conversation: ", "Conv: ").replace("Academic Talk:", "Talk:")}
                            </button>
                        );
                    })}
                    </div>
                </div>
                
                {/* Detailed Review Section */}
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    Detailed Analysis & Transcripts
                </h2>
                
                <div className="space-y-12 mb-24">
                    {reviewSegments.map((segment, index) => (
                    <div id={`review-${segment.id}`} key={segment.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden scroll-mt-24">
                        <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-200 text-slate-600 font-bold text-sm">
                            {index + 1}
                            </span>
                            <h3 className="font-bold text-slate-800 text-lg">{segment.title}</h3>
                        </div>
                        <span className="text-xs uppercase font-bold text-slate-400 bg-white px-2 py-1 rounded border border-slate-200">
                            {segment.type}
                        </span>
                        </div>
                        
                        <div className="p-6">
                            {/* Review Audio Player */}
                            <div className="mb-8">
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                                Original Audio
                                </h4>
                                <AudioPlayer 
                                    text={segment.transcriptText} 
                                    speakerType={segment.speakerType} 
                                    onAudioEnd={() => {}} 
                                />
                            </div>

                            {/* Transcript Section */}
                            <div className="mb-8 bg-slate-50 rounded-lg p-5 border border-slate-200">
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                </svg>
                                Audio Transcript
                                </h4>
                                <p className="text-slate-700 text-sm leading-relaxed font-serif italic border-l-4 border-slate-300 pl-4">
                                "{segment.transcriptText}"
                                </p>
                            </div>

                            {/* Questions & Explanations */}
                            <div className="space-y-8">
                                {segment.questions.map(q => (
                                <QuestionBlock
                                    key={q.id}
                                    question={q}
                                    selectedOptionIndex={testState.answers[q.id]}
                                    onSelectOption={() => {}}
                                    showResult={true}
                                />
                                ))}
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
         </div>
      </div>
    );
  }

  // --- MAIN INTERFACE ---
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      
      {/* 2026 Format Header */}
      <header className="bg-slate-900 text-white shadow-md h-16 flex-shrink-0 z-20 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center font-bold text-white">T</div>
            <div className="hidden sm:block">
                <h1 className="font-bold text-sm leading-tight">TOEFL iBT</h1>
                <p className="text-xs text-slate-400">Listening Section (Adaptive)</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
             {/* Module Badge */}
             <div className="hidden md:flex flex-col items-end">
                 <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Current Module</span>
                 <span className="font-semibold text-sm text-blue-200">{activeModule.label}</span>
             </div>

             {/* Module Clock */}
             <div className={`bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 flex items-center gap-3 transition-colors duration-300 ${!showQuestions && !isIntro ? 'opacity-50' : 'opacity-100'}`}>
                 <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
                 <span className={`font-mono font-bold text-xl ${timeLeft < 60 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                    {formatTime(timeLeft)}
                 </span>
                 {!showQuestions && !isIntro && <span className="text-xs text-slate-500 uppercase font-bold ml-1">Paused</span>}
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col md:flex-row max-w-7xl mx-auto w-full overflow-hidden">
        
        {/* Left Panel: Test Content */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth pb-32">
            <div className="max-w-3xl mx-auto">
                
                {/* Intro Screen */}
                {isIntro ? (
                    <div className="text-center py-10">
                        <h2 className="text-3xl font-bold text-slate-800 mb-6">{currentSegment.title}</h2>
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-8 mb-8 text-left">
                            <p className="text-lg text-slate-700 leading-relaxed mb-4">{currentSegment.transcriptText}</p>
                            <ul className="list-disc list-inside text-slate-600 space-y-2">
                                <li><strong>Module 1:</strong> Routing (All students)</li>
                                <li><strong>Module 2:</strong> Adaptive (Based on Module 1)</li>
                                <li><strong>Headphones:</strong> High-Fidelity Stereophones Mode</li>
                            </ul>
                        </div>
                        <AudioPlayer 
                            text={currentSegment.transcriptText} 
                            speakerType={currentSegment.speakerType}
                            onAudioEnd={handleAudioEnd}
                        />
                         <div className="mt-8 flex flex-col items-center gap-4">
                            <button onClick={handleNext} className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition shadow-lg w-full md:w-auto min-w-[200px]">
                                Begin Module 1
                            </button>
                            <button onClick={handleJumpToReview} className="text-slate-500 hover:text-blue-600 text-sm font-medium underline transition-colors flex items-center gap-1">
                                <span>View Analysis / Practice Mode</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Active Test Item */
                    <div className="animate-fade-in-up">
                        {/* Task Header */}
                        <div className="flex items-center justify-between mb-6">
                            <span className="inline-flex items-center px-3 py-1 rounded text-xs font-bold bg-slate-100 text-slate-600 uppercase tracking-wide">
                                Item {testState.currentSegmentIndex} of {activeModule.segments.length - 1}
                            </span>
                            {currentSegment.type === 'discrete' && (
                                <span className="text-xs font-bold text-red-500 uppercase tracking-wide flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                    Text Hidden
                                </span>
                            )}
                        </div>

                        <h2 className="text-2xl font-bold text-slate-900 mb-6">
                            {currentSegment.type === 'discrete' ? 'Listen and Choose a Response' : currentSegment.title}
                        </h2>

                        {/* Visual Context */}
                        {currentSegment.imageUrl && (
                             <div className="mb-8 rounded-xl overflow-hidden shadow-sm border border-slate-200">
                                 <img src={currentSegment.imageUrl} alt="Context" className="w-full h-64 object-cover" />
                             </div>
                        )}

                        {/* Audio Player */}
                        <AudioPlayer 
                            text={currentSegment.transcriptText} 
                            speakerType={currentSegment.speakerType}
                            onAudioEnd={handleAudioEnd}
                        />

                        {/* Instructions for Discrete Items */}
                        {currentSegment.type === 'discrete' && !showQuestions && (
                            <div className="text-center text-slate-500 italic mb-8">
                                Audio is playing... Select the best response once audio completes.
                            </div>
                        )}

                        {/* Questions */}
                        { showQuestions && (
                            <div className="space-y-6">
                                {currentSegment.questions.map((q) => (
                                    <QuestionBlock 
                                        key={q.id}
                                        question={q}
                                        selectedOptionIndex={testState.answers[q.id]}
                                        onSelectOption={handleSelectOption}
                                        showResult={false}
                                    />
                                ))}

                                <div className="flex justify-end pt-8">
                                    <button
                                        onClick={handleNext}
                                        className="bg-slate-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-800 transition shadow-xl flex items-center"
                                    >
                                        Next Item
                                        <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Transcript Toggle (Hidden by default for realism) */}
                         <div className="mt-12 pt-8 border-t border-slate-100 text-center">
                            <button 
                                onClick={() => setTranscriptVisible(!transcriptVisible)}
                                className="text-xs font-semibold text-slate-400 hover:text-blue-500 transition-colors uppercase tracking-widest"
                            >
                                {transcriptVisible ? "Hide Transcript" : "View Transcript (Practice Mode)"}
                            </button>
                            {transcriptVisible && (
                                <div className="mt-4 p-6 bg-slate-50 rounded text-sm text-slate-600 text-left leading-relaxed border border-slate-200 font-serif">
                                    {currentSegment.transcriptText}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* Right Panel: Scratchpad (Sticky) */}
        <div className="w-full md:w-80 lg:w-96 bg-white border-l border-slate-200 flex-shrink-0 md:h-[calc(100vh-4rem)] sticky top-16 hidden md:block z-10">
             <div className="h-full p-6 flex flex-col">
                 <div className="mb-4 bg-yellow-50 p-3 rounded text-xs text-yellow-800 border border-yellow-200">
                    <strong>Note Taking Strategy:</strong> For "Listen & Choose", do not take notes. Focus on the audio. For Talks, keep notes brief.
                 </div>
                 <NotePad />
             </div>
        </div>
      </main>
    </div>
  );
}