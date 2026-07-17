// 임시 데이터 정의
export interface WordItem {
  id: number;
  word: string;
  meaning: string;
  range: number;
}

// 목업 데이터
export const words: WordItem[] = [

  { id: 0, word: "resume", meaning: "이력서", range: 1 },
  { id: 1, word: "prohibit", meaning: "금지하다", range: 2 },
  { id: 2, word: "corporation", meaning: "주식회사", range: 3 },
  { id: 3, word: "foster", meaning: "촉진하다", range: 4 },
  { id: 4, word: "compliance", meaning: "준수", range: 5 },
  { id: 5, word: "degree", meaning: "학위", range: 1 },
  { id: 6, word: "approval", meaning: "승인", range: 2 },
  { id: 7, word: "deadline", meaning: "마감일", range: 3 },
  { id: 8, word: "employee", meaning: "고용인", range: 4 },
  { id: 9, word: "outline", meaning: "개요", range: 5 },
  { id: 10, word: "payroll", meaning: "임금 대장", range: 1 },
  { id: 11, word: "form", meaning: "종류", range: 2 },
  { id: 12, word: "sample", meaning: "표본", range: 3 },
  { id: 13, word: "assist", meaning: "돕다", range: 4 },
  { id: 14, word: "department", meaning: "부서", range: 5 },
  { id: 15, word: "recruit", meaning: "모집하다", range: 1 },
  { id: 16, word: "immediately", meaning: "즉시", range: 2 },
  { id: 17, word: "monitor", meaning: "감독하다", range: 3 },
  { id: 18, word: "manner", meaning: "방식", range: 4 },
  { id: 19, word: "feedback", meaning: "반응", range: 5 },
]