// import { useState } from 'react'
import './Test.css'

// import { dummyWords, type WordItem } from './data';

const words = [
  {
        id : 0,
        word : "resume",
        meaning : "이력서",
        range : 1
    },

    {
        id : 1,
        word : "prohibit",
        meaning : "금지하다",
        range : 2
    },

    {
        id : 2,
        word : "corporation",
        meaning : "주식회사",
        range : 3
    },

    {
        id : 3,
        word : "foster",
        meaning : "촉진하다",
        range : 4
    },

    {
        id : 4,
        word : "compliance",
        meaning : "준수",
        range : 5
    }
]

export default function App() {
  // const [products, setProducts] = useState<WordItem[]>(dummyWords);
  // const navigate = useNavigate();
  
  // const testClick = () => navigate('/test');

  return (
    <>
      <div className='wordtest'>
        <div className='testform'>
          <div className='wordwrap'>
            <div className='questionwrap'>
              {
                words.map((word) => (
                  <>
                    <div className='question'>
                      {word.word}
                    </div>
                  </> 
                ))
              }
            </div>  
            <div className='answerwrap'>
              {
                words.map((word) => (
                  <input className='answerinput' name='answerinput' key = {word.id} />
                ))
              }
            </div>  
          </div>
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

