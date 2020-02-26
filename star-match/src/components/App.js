/* eslint-disable indent */
import React, { useState,useEffect } from 'react';

export function App() {
 
  return (<Game />);
}

    
//Play again button
const PlayAgain= (props)=>
{
  return(
    <div> 
      
      <div clasName="message" style={{
        color:props.gameStatus==='lost' ? 'red' :'green',
          
      }}>{props.gameStatus ==='lost'? 'Game Over' :'Nice!! '}</div>
      <button onClick={props.onClick}> Play Again </button>
    </div>
  );
};

// Math science
const utils = {
  // Sum an array
  sum: arr => arr.reduce((acc, curr) => acc + curr, 0),

  // create an array of numbers between min and max (edges included)
  range: (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i),

  // pick a random number between min and max (edges included)
  random: (min, max) => min + Math.floor(Math.random() * (max - min + 1)),

  // Given an array of numbers and a max...
  // Pick a random sum (< max) from the set of all available sums in arr
  randomSumIn: (arr, max) => {
    const sets = [[]];
    const sums = [];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0, len = sets.length; j < len; j++) {
        const candidateSet = sets[j].concat(arr[i]);
        const candidateSum = utils.sum(candidateSet);
        if (candidateSum <= max) {
          sets.push(candidateSet);
          sums.push(candidateSum);
        }
      }
    }
    return sums[utils.random(0, sums.length - 1)];
  },
};
//star component
const PlayStar=(props)=>
{
  return(
    utils.range(1,props.starCount).map(starId=>
      <div key={starId} className="star" />,
    )
  );
};

//play number
const PlayNumber=(props)=>
{
  return (
    <button  className="number" 
      style={{backgroundColor:colors[props.status]}}
      onClick={()=>props.onClick(props.number,props.status)}>{props.number}</button>
  );
};

// v1 STAR MATCH - Starting Template
const StarMatch = (prop) => {
  const [stars,setStars] = useState(utils.random(1,9));
  const [avaliableNums,setAvaliablenum] =useState(utils.range(1,9));
  const[candidateNums,setCandidatenum] =useState([]);
  const candidateWrong = utils.sum(candidateNums) > stars ;
  const [secondsLeft,setSecondsLeft] = useState(10);
 // const gameIsDone = avaliableNums.length ===0 ;
  
  const gameStatus = avaliableNums.length ===0 ?'won' : secondsLeft !== 0 ?'active':'lost';
 
  
  useEffect(()=>{
    //console.log('rendering..');
    if(secondsLeft > 0 && avaliableNums.length > 0)
    {
      const timerId = setTimeout(()=>{
          
        setSecondsLeft(secondsLeft - 1);
      },1000);
      return ()=>clearTimeout(timerId);
    }
    
  });
  

  
  const onNumberClick=(number,currentStatus)=>
  {
    // eslint-disable-next-line curly
    if(currentStatus == 'used' || gameStatus !=='active')
      return;
    //candidate 
    const newCandidateNums = (currentStatus==='avaliable')? candidateNums.concat(number) :     candidateNums.filter(n=> n!==number );
    if(utils.sum(newCandidateNums) !== stars)
    {
      setCandidatenum(newCandidateNums);
    }
    else
    {
      const newAvaliableNums = avaliableNums.filter(
        n=>!newCandidateNums.includes(n),
      );
      setAvaliablenum(newAvaliableNums);
      setStars(utils.randomSumIn(newAvaliableNums,9));
      setCandidatenum([]);
    }
    
  };
  
  const findStatus=(number)=>{
    if(!avaliableNums.includes(number))
    {
      return 'used';
    }
    if(candidateNums.includes(number))
    {
      return candidateWrong?'wrong':'candidate';
    }
    return 'avaliable';
  };
 
  return (
    <div className="game">
      <div className="help">
        Pick 1 or more numbers that sum to the number of stars
      </div>
      <div className="body">
        <div className="left">
          {gameStatus!== 'active'?( <PlayAgain onClick={prop.startNewGame} gameStatus={gameStatus}/>) :
          
            (<PlayStar  starCount={stars}/>)
          
          }
        </div>
        <div className="right">
          {  utils.range(1,9).map(number =>
            // eslint-disable-next-line react/jsx-key
            <PlayNumber status={findStatus(number)} onClick={onNumberClick} number={number}/>,
          )
          }
        </div>
      </div>
      <div className="timer">Time Remaining: {secondsLeft}</div>
    </div>
  );
};

// Color Theme
const colors = {
  available: 'lightgray',
  used: 'lightgreen',
  wrong: 'lightcoral',
  candidate: 'deepskyblue',
};



const Game = () =>{
  const[gameId,setGameId] = useState(1);
  return <StarMatch key={gameId} startNewGame={() => setGameId(gameId+1)}/> ;
};


