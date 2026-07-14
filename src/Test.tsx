import { useState, Suspense } from 'react';
import { useLocation } from 'react-router';

// import { useSuspenseAsync } from

import './Test.css'

// 임시 데이터 정의
interface WordItem {
  id: number;
  word: string;
  meaning: string;
  range: number;
}

const words: WordItem[] = [
  { id: 0, word: "resume", meaning: "이력서", range: 1 },
  { id: 1, word: "prohibit", meaning: "금지하다", range: 2 },
  { id: 2, word: "corporation", meaning: "주식회사", range: 3 },
  { id: 3, word: "foster", meaning: "촉진하다", range: 4 },
  { id: 4, word: "compliance", meaning: "준수", range: 5 }
];

function Wordwrap() {

  const location = useLocation();
  console.log(location.state);

  const { range, type } = location.state;

  const testwords = words.filter((word) => word.range === range);
  // const testwords = useSuspenseAsync(`testwords-day-${range}-${type}`, () => fetchwords(range, type));

  return (
    <>
    <div className='wordwrap'>
        {
          testwords.map((testword: WordItem) => (
            <div className='questionwrap' key = {testword.id}>
              
              {/* 문제 */}
              <div className='question'>
                {type === 'word' ? testword.meaning : testword.word}
              </div>

              {/* 입력창 */}
              <div className='answerwrap'>
                <input className='answerinput' name='answerinput' />
              </div>
            </div>
          ))
        }
      </div>
    </>
  )
}


export default function App() {
  return (
    <>
      <div className='wordtest'>
        <div className='testform'>
          <Suspense fallback={<div>테스트를 불러오고 있습니다.</div>}>
            <Wordwrap />
          </Suspense>

          <div className='scorewrap'>

            <button 
              className='retryBtn'>
              다시 풀기
            </button>

            <button 
              className='scoreBtn'>
              채점
            </button>

          </div>
        </div>

      </div>
    </>
  )
}

