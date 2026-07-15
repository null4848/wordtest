import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router';
import './Test.css'

// 임시 데이터 정의
interface WordItem {
  id: number;
  word: string;
  meaning: string;
  range: number;
}

// 단어 데이터
const words: WordItem[] = [
  { id: 0, word: "resume", meaning: "이력서", range: 1 },
  { id: 1, word: "prohibit", meaning: "금지하다", range: 2 },
  { id: 2, word: "corporation", meaning: "주식회사", range: 3 },
  { id: 3, word: "foster", meaning: "촉진하다", range: 4 },
  // { id: 4, word: "compliance", meaning: "준수", range: 5 }
];

// 범위별 단어 맵 생성
const wordsByRangeMap = words.reduce((map, item) => {
  const list = map.get(item.range) || [];
  list.push(item);
  map.set(item.range, list);
  return map;
}, new Map<number, WordItem[]>());

// 돌려주는 값 정의
type Result<T> = 
  | { status: "pending" } // 불러오는 중
  | { status: "success"; data: T } // 성공 (data 있음)
  | { status: "error"; error: Error }; // 실패 (error 있음)

// 비동기 함수 훅
function useAsync<T>(asyncFunction: () => Promise<T>) {
  // 단계 저장
  const [result, setResult] = useState<Result<T>>({ status: "pending" }); // 기본값 pending

  // 불러오기
  useEffect(() => {
    // pending 돌려주기
    setResult({ status: "pending" });

    // 늦게 온 응답 무시 (지금 것이 최신인지 확인)
    let isCurrent = true;

    asyncFunction()

      // 성공하면 success, data
      .then((data) => {
        if (isCurrent) {
          setResult({ status: "success", data }); // 성공
        }
      })

      // 실패하면 error, error
      .catch((error) => {
        if (isCurrent) {
          // error가 Error 개체인지 확인, 아니면 Error 개체로 변환
          const normalizedError = error instanceof Error ? error : new Error(String(error));
          setResult({ status: "error", error: normalizedError }); // 실패
        }
      });

      // 컴포넌트가 사라지거나 업데이트 되면 false로 변경
      return () => {
        isCurrent = false;
      }

  // 의존성 배열
  }, [asyncFunction]); // asyncFunction이 바뀌면 다시 불러오기

  // 결과 반환
  return result;
}

// 단어 범위에 따라 단어를 가져오는 함수
function fetchWords(id: number) {
  const filteredWords = wordsByRangeMap.get(id);

  if (filteredWords == null || filteredWords.length === 0) {
    return Promise.reject(new Error("해당 범위의 단어를 찾을 수 없습니다."));
  }

  return Promise.resolve(filteredWords);
}

// 단어 문제 컴포넌트
function Wordwrap() {

  const location = useLocation();
  const { range, type } = location.state;

  // const results = useAsync(() => fetchWords(range));
  
  // 함수를 캐싱하는 새로운 함수 선언
  // useCallback 사용
  const cachefetchWords = useCallback(() => {
    return fetchWords(range);
  }, [range]); // range가 바뀌기 전까지는 캐싱 유지
  
  // 캐싱된 함수 전달
  const results = useAsync(cachefetchWords);

  if (results.status === "pending") {
    return <div className='result'>단어 시험을 불러오고 있습니다!</div>;
  }

  if (results.status === "error") {
    return <div className='result'>{results.error.message}</div>;
  }

  return (
    <>
    <div className='wordwrap'>
        {
          results.data.map((result) => (
            <div className='questionwrap' key = {result.id}>
              
              {/* 문제 */}
              <div className='question'>
                {type === 'word' ? result.meaning : result.word}
              </div>

              {/* 입력창 */}
              <div className='answerwrap'>
                <input 
                  className='answerinput' 
                  name='answerinput'
                  type = 'text'
                />
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
        <form 
          className='testform'>
          <Wordwrap />
          <div className='scorewrap'>

            <button 
              className='retryBtn'>
              다시 풀기
            </button>

            <button type='submit' 
              className='scoreBtn'>
              채점
            </button>

          </div>
        </form>

      </div>
    </>
  )
}

