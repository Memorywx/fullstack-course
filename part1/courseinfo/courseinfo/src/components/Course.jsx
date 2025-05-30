import React from 'react'

const Header = ({cname}) => {
  return (
    <>
      <h1>{cname}</h1>
    </>
  )
}

const Part = ({name, exercises}) => {
  return (
    <>
      <p>{name} {exercises}</p>
    </>
  )
}

const Content = ({parts}) => {
  return (
    <div>
      {parts.map(part => 
        <Part key={part.id} name={part.name} exercises={part.exercises}/>
      )}
    </div>
  )
}

const Total = ({ parts }) => {
  const sum = parts.reduce((total, part) => {
    return total + part.exercises
  }, 0);

  return (
    <>
      <p>total of {sum} exercises</p>
    </>
  )

}

const Course = ({ courses }) => {
  return (
    <>
     {courses.map(course => 
      <div key={course.id}>
        <Header cname={course.name}/>
        <Content parts={course.parts}/>
        <Total parts={course.parts}/>
      </div>
     )}
    </>
  )
}

export default Course