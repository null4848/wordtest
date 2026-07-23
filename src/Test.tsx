import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router';
import { type WordItem, words } from './data/wordData';

import './Test.css'

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

// 점수 계산 함수
const calculateScore = (
  data: WordItem[],
  answers: Record<number, string>,
  type: 'word' | 'meaning'
): { score : number; wrongIds: number[] } => {

  // 맞춘 개수
  let scoreAnswer = 0;
  // 틀린 단어 아이디
  const wrongIds: number[] = []

  data.forEach((item) => {
    // 사용자가 입력한 값 가져오기
    const userAnswer = (answers[item.id] || "").trim().toLowerCase();
    
    // 정답 가져오기
    // type이 word(철자) word 값 가져오기
    // type이 word가 아니라면 (meaning) meaning 값 가져오기
    const correctAnswer = type === 'word' 
      ? item.word.trim().toLowerCase() 
      : item.meaning.trim();

    // 사용자가 입력한 값이랑 정답 비교
    if (userAnswer === correctAnswer) {
      // 맞춘 개수 ++
      scoreAnswer++;
    } else {
      // worngIds에 틀린 단어 id 저장
      wrongIds.push(item.id)
    }
  });

  // 맞춘 개수 리턴
  return { score : scoreAnswer, wrongIds };
};

// 문제 목록 컴포넌트
function Quizs({ handleInputChange, results, type, answers, wrongIds, isResultVisible }: any) {
  
  return (
    <>
    <div className='wordwrap'>
      {
        results.data.map((result: WordItem) => {
          // 채점 완료, 틀린 목록에 포함된 경우
          const isWrong = isResultVisible && wrongIds.includes(result.id);

          // 정답 문구
          const correctAnswer = type === 'word' ? result.word : result.meaning;

          return (
            <div className={`questionwrap ${isWrong ? 'wrong' : ''}`} key = {result.id}>              
             
              {/* 문제 */}
              <div className='question'>
                {type === 'word' ? result.meaning : result.word}
              </div>

              {/* 입력창 */}
              <div className='answerwrap'>
                <input 
                  className={`answerinput ${isWrong ? 'wronginput' : ''}`}
                  name={`answerinput-${result.id}`}
                  type='text'
                  value={answers[result.id] || ''}
                  onChange={ (event) => handleInputChange(result.id, event.target.value)}

                  // 엔터 키 눌렀을 때 폼 제출 방지
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                    }
                  }}

                />
                
                {isWrong && (
                  <div className='correctanswer'>
                    {correctAnswer}
                  </div>
                )}
              </div>


            </div>
          )
        })
      }
    </div>
    
    </>
  )
}

// 하단 버튼 컴포넌트
function QuizAction({setAnswers, setIsResultVisible, setWrongIds}: any) {
  
  // 다시 풀기 버튼 클릭 시 이벤트
  const retryClick = () => {
    // 정답 초기화
    setAnswers({})
    // 틀린 id 초기화
    setWrongIds([]);
    // 결과창 숨기기
    setIsResultVisible(false); 
  }
  
  return (
    <>
      <button 
        type='button'
        className='retryBtn'
        onClick={retryClick}
        >
        다시 풀기
      </button>

      <button 
        type='submit' 
        className='scoreBtn'>
        채점
      </button>
    </>
  )
  
}

// 결과창 컴포넌트
function Resultwrap({ isClicked, score, total }: any) {
  if(!isClicked) return null;

  return (
    <>
      <div className='resultwrap'>
        <h3>시험 결과</h3>
        <p>총 <span>{total}</span>문제 중 <span>{score}</span>문제를 맞추셨습니다!</p>
      </div>
    </>
  )
}

// 메인 단어 문제 컴포넌트
function Wordwrap() {

  // 이전 컴포넌트에서 받아온 값 확인
  const location = useLocation();
  const { range, type } = location.state;
  
  // 함수를 캐싱하는 새로운 함수 선언
  // useCallback 사용
  const cachefetchWords = useCallback(() => {
    return fetchWords(range);
  }, [range]); // range가 바뀌기 전까지는 캐싱 유지
  
  // 캐싱된 함수 전달
  const results = useAsync(cachefetchWords);

  // 답안 상태 정의
  const [ answers, setAnswers ] = useState<Record<number, string>>({});
  const [ isResultVisible , setIsResultVisible ] = useState<boolean>(false);
  const [ wrongIds, setWrongIds ] = useState<number[]>([]);

  // result 상태에 따른 리턴값
  if (results.status === "pending") {
    return <div className='result'>단어 시험을 불러오고 있습니다!</div>;
  }

  if (results.status === "error") {
    return <div className='result'>{results.error.message}</div>;
  }  

  // 함수 이용해서 맞춘 개수, 틀린 목록 받아오기
  const { score, wrongIds: calculatedWrongIds } = results.status === "success"
    ? calculateScore(results.data, answers, type)
    : { score : 0, wrongIds: []};
  
  // 채점 버튼 클릭 시
  // 점수 계산 로직
  const handleScore = (event: React.FormEvent) => {
    event.preventDefault(); // 새로고침 방지!

    if (results.status !== "success") return;

    // 유효성 검사
    const isAllAnswered = results.data.every(
      (item) => answers[item.id] && answers[item.id].trim() !== ""
    );

    if (!isAllAnswered) {
      alert("모든 답안을 입력해주세요!")
      return;
    }

    setWrongIds(calculatedWrongIds) // 계산된 틀린 단어 id 상태에 저장
    setIsResultVisible(true);
  }

    
  // 개별 input의 글자가 바뀔 때 id에 따라 값을 업데이트하는 함수
  const handleInputChange = (id: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: value, // 해당 id의 value만 변경
    }));
  };

  return (
    <>

      <form 
        className='testform'
        onSubmit={handleScore}>
        <div className='scorewrap'>

          {/* 문제 목록 영역 */}
          <Quizs
            handleInputChange={handleInputChange}
            results={results}
            type={type}
            answers={answers}
            wrongIds={wrongIds}
            isResultVisible={isResultVisible}            
          />

          {/* 다시 풀기, 채점 버튼 영역 */}
          <QuizAction
            setAnswers={setAnswers}
            setIsResultVisible={setIsResultVisible}
            setWrongIds={setWrongIds}
          />

        </div>

        {/* 결과창 영역 */}
        <Resultwrap 
          isClicked={isResultVisible}
          score={score}
          total={results.data.length}
        />

      </form>

    </>
  )
}

export default function App() {
  return (
    <>
      <div className='wordtest'>
        <Wordwrap />
      </div>
    </>
  )
}

