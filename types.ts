export interface Option {
  label: string; // "A", "B", etc.
  text: string;
}

export interface Question {
  id: number;
  questionText?: string;
  options: Option[];
  correctAnswerIndex: number; // 0-3
  explanation: string;
}

export interface TestSegment {
  id: string;
  title: string;
  type: 'intro' | 'discrete' | 'conversation' | 'announcement' | 'lecture';
  transcriptText: string;
  speakerType: 'male' | 'female' | 'duo' | 'lecturer'; 
  questions: Question[];
  imageUrl?: string; // For visual context
}

export interface Module {
  id: 'module-1' | 'module-2-hard' | 'module-2-easy';
  label: string;
  description: string;
  timeLimitSeconds: number;
  segments: TestSegment[];
}

export interface TestState {
  currentModuleId: string;
  currentSegmentIndex: number;
  answers: Record<number, number>; // questionId -> selectedOptionIndex
  moduleScores: Record<string, number>; // moduleId -> score
  isCompleted: boolean;
  pathTaken: 'hard' | 'easy' | null;
  startTime: number;
}