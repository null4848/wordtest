// import { useState } from 'react'
import {useNavigate} from 'react-router-dom';
import './App.css'

// import { dummyWords, type WordItem } from './data';

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
  const testClick = () => navigate('/test');

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
                <button className='rangeBtn' key={range.id} >
                  {range.title}
                </button>
              ))
            }
          </div>
          <div className='typewrap'>
            <strong>문제 유형</strong>
            <div className='typeBtn_div'></div>
            <button className='typeBtn wordBtn'>뜻</button>
            <button className='typeBtn meaningBtn'>철자</button>
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

