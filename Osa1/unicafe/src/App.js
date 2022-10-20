import { useState } from 'react'

const StatisticLine = ({text, value}) => {
  if (text === "positive") {
    return (
      <table>
        <tbody>
          <tr>
            <td>{text} {value} %</td>
          </tr>
        </tbody>
      </table>
      )
  }
  return (
    <table>
      <tbody>
        <tr>
          <td>{text} {value}</td>
        </tr>
      </tbody>
    </table>
  )
  
}


const Statistics = ({good, bad, neutral}) => {
  
  if (good + neutral + bad === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  } 

  return (
  <div>
    <StatisticLine text="good" value={good} />
    <StatisticLine text="neutral" value={neutral} />
    <StatisticLine text="bad" value={bad} />
    <StatisticLine text="all" value={good + neutral + bad} />
    <StatisticLine text="avarage" value={(good - bad) / (good + neutral + bad)} />
    <StatisticLine text="positive" value={good / (good + neutral + bad) * 100} />
  </div>
  )
}

const Button = ({handleClick, text})=>(
    <button onClick={handleClick}>
    {text}
    </button>   
)

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGood = () => {
    setGood(good + 1)
  }

  const handleNeutral = () => {
    setNeutral(neutral + 1)
  }

  const handleBad = () => {
    setBad(bad + 1)
  }

  return (
    <div>
      <h1>Give feedback</h1>
 
      <Button handleClick={handleGood} text="good" />
      <Button handleClick={handleNeutral} text="neutral" />
      <Button handleClick={handleBad}  text= "bad" />

      <h2>Statistics</h2>

      <Statistics good ={good} neutral = {neutral} bad = {bad}/>
    </div>
  )
}

export default App
