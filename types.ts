export interface FormData {
  groupLevel: string;
  textLength: string;
  numQuestions: number;
  subject: string;
}

export interface Question {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  answer: string;
}

export interface GeneratedContent {
  title: string;
  text: string;
  questions: Question[];
}
