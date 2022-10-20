import { useState } from 'react'

const Button =({handleClick,text}) =>{

 return ( 
  <button onClick={handleClick}>
    {text}
  </button>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.'
  ]

  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(Array(anecdotes.length).fill(0))
  const [mostVotes, setmostVotes] = useState(0)
  const [popularAnectode, setPopularAnectode] = useState(0)

  const randomAnecdote = () => {
    setSelected(Math.floor(Math.random() * anecdotes.length))
  }

  const vote = () => {
    const copy = [...points]
    copy[selected] += 1
    setPoints(copy)
    
  }

  if (points[selected] > mostVotes) {
    let copy = mostVotes
    copy = points[selected]
    setmostVotes(copy)

    const copy2 = selected
    setPopularAnectode(copy2) 
  }

  return (
    <div>
      <h2>Anecdote of the day</h2>
      {anecdotes[selected]}
      <div> has {points[selected]} votes</div>
      <div>
        <Button handleClick={vote} text ="vote"/> 
        <Button handleClick={randomAnecdote} text="next anectode"/>
      </div>
      <h2>Anecdote with most votes</h2>
      <div>{anecdotes[popularAnectode]}<div>has {mostVotes} votes</div></div>
    </div>
    
  )
}

export default App