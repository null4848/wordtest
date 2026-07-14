import { useState } from 'react'
import { useNavigate } from 'react-router';
import './App.css'

// 단어 범위
const ranges = [
  { title : 'Day1', id: 1 },
  { title : 'Day2', id: 2},
  { title : 'Day3', id: 3},
  { title : 'Day4', id: 4},
  { title : 'Day5', id: 5}
]

export default function App() {
  // 네비게이션 (페이지 이동)
  const navigate = useNavigate();

  // 버튼 클릭
  // 범위, 유형 저장 기본값 지정
  const [selectedRange, setSelectedRange] = useState(1);
  const [selectedType, setSelectedType] = useState('word');

  const testClick = () => {
    navigate('/test', {
      state: {
        range : selectedRange,
        type: selectedType
      }
    });
  };

  return (
    <>
      <div className='wordtest'>
        <div className='testform'>
          <div className='rangewrap'>
            <strong>출제 범위</strong>
            <div className='rangeBtn_div'></div>
            {
              // 반복
              ranges.map((range) => (
                <button 
                  // 선택된 버튼 active 표시
                  className={`rangeBtn ${selectedRange === range.id ? 'active' : ''}`}
                  key={range.id} 
                  onClick={() => setSelectedRange(range.id)}
                >
                  {range.title}
                </button>
              ))
            }
          </div>
          <div className='typewrap'>
            <strong>문제 유형</strong>
            <div className='typeBtn_div'></div>
            
            <button 
              className={`typeBtn wordBtn ${selectedType === 'word' ? 'active' : ''}`}
              onClick={() => setSelectedType('word')}
            >
              철자
            </button>

            <button 
              className={`typeBtn meaningBtn ${selectedType === 'meaning' ? 'active' : ''}`}
              onClick={() => setSelectedType('meaning')}
            >
              뜻
            </button>

          </div>
          <div className='testwrap'>
            <button 
              className='testBtn'
              // 클릭시 페이지 이동
              onClick={testClick}>
              테스트 응시
            </button>
          </div>
        </div>

      </div>
    </>
  )
}

