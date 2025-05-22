import { useState } from 'react'

const Button = (props) => {
  return (
    <button onClick={props.handleClick} > {props.text} </button>
  )
}

const StatisticLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  )
}

const Statistics = (props) => {
  if (props.all === 0) {
    return (
      <>
        <h2>statistics</h2>
        <p>No feedback given</p>
      </>
    )
  }
  return (
    <>
      <h2>statistics</h2>
      <table>
        <tbody>
          <StatisticLine text='good' value={props.good} />
          <StatisticLine text='neutral' value={props.neutral} />
          <StatisticLine text='bad' value={props.bad} />
          <StatisticLine text='all' value={props.all} />
          <StatisticLine text='average' value={props.average} />
          <StatisticLine text='positive' value={props.positive} />
        </tbody>
      </table>
    </>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [point, setPoint] = useState(0)

  const setToGood = (newValue) => {
    setGood(newValue)
    const newPoint = point + 1
    setPoint(newPoint)
  }
  const setToNeutral = (newValue) => {
    setNeutral(newValue)
  }
  const setToBad = (newValue) => {
    setBad(newValue)
    const newPoint = point - 1
    setPoint(newPoint)
  }

  const all = good + neutral + bad
  const average = (point / all).toFixed(2)
  const positive = ((good / all) * 100).toFixed(1) + '%'

  return (
    <div>
      <h2>give feedback</h2>
      <Button handleClick={() => setToGood(good + 1)} text="good" />
      <Button handleClick={() => setToNeutral(neutral + 1)} text='neutral' />
      <Button handleClick={() => setToBad(bad + 1)} text='bad' />
      <Statistics good={good} neutral={neutral} bad={bad} all={all} average={average} positive={positive} />
    </div>
  )
}

export default App
