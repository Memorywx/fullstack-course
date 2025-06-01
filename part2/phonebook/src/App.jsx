import { useState, useEffect } from 'react'
// import axios from 'axios'
import personService from './service/person'


const NotificationSuccess = ({ message }) => {
  if (message === null || message === '') {
    return null
  }

  const sytle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginbottom: '10px'
  }
  return (
    <div style={sytle}>
      {message}
    </div>
  )
}

const NotificationError = ({ message }) => {
  if (message === null || message === '') {
    return null
  }

  const sytle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginbottom: '10px'
  }
  return (
    <div style={sytle}>
      {message}
    </div>
  )
}

const Display = ({ name, number, deleteFunc }) => {
  return (
    <>
      <p>{name} {number} <button onClick={deleteFunc}>delete</button></p>
    </>
  )
}

const Persons = ({ persons, handleDelete }) => {
  return (
  <>
      {persons.map(person =>
        <Display key={person.id} name={person.name} number={person.number}
          deleteFunc={() => handleDelete(person.id)} />
      )}
    </>
  )
}

const Filter = ({ term, addNewTerm }) => {
  return (
    <form >
      <div>
        filter shown with<input value={term} onChange={addNewTerm} />
      </div>
    </form>
  )
}

const PersonForm = ({ onSubmitFunc, newName, addNewName, newNumber, addNewNumber }) => {
  return (
    <form onSubmit={onSubmitFunc}>
      <div>
        name: <input value={newName} onChange={addNewName} />
      </div>
      <div>
        number: <input value={newNumber} onChange={addNewNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [term, setNewTerm] = useState('')

  const [messageSuccess, setMessageSuccess] = useState('')
  const [messageError, setMessageError] = useState('')

  useEffect(() => {
    console.log('effect')
    personService
      .getAll()
      .then(resPerson => {
        console.log(resPerson)
        setPersons(resPerson)
      })
  }, [])


  const addPerson = (event) => {
    event.preventDefault()
    if (persons.some(person => (person.name === newName && person.number === newNumber))) {
      alert(`${newName} is already added to phonebook`)
      // setNewName('')
      return
    }

    const existPerson = persons.find(person => person.name === newName)
    if (existPerson) {
      if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {

        personService
          .update(existPerson.id, {
            ...existPerson,
            number: newNumber
          })
          .then((resPerson) => {
            setPersons(persons.map(person => person.id !== resPerson.id ? person : resPerson))
            setNewName('')
            setNewNumber('')
            setMessageSuccess(`Added ${resPerson.name}`)
            setTimeout(() => {
              setMessageSuccess(null)
            }, 5000)
          })
          .catch(() => {
            console.log('fail')
            setMessageError(`Information of ${newName} has already been removed from server`)
            setTimeout(() => {
              setMessageError(null)
            }, 5000)
          })

      }
      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    personService
      .create(personObject)
      .then(resPerson => {
        console.log(resPerson)
        setPersons(persons.concat(resPerson))
        setNewName('')
        setNewNumber('')
        setMessageSuccess(`Added ${resPerson.name}`)
        setTimeout(() => {
          setMessageSuccess(null)
        }, 5000)
      })
      .catch(error => {
        console.log(error)
        // console.log(error.response.data)
        setMessageError(`${error.response.data.error}`)
        setTimeout(() => {
          setMessageError(null)
        }, 5000)
      })

  }

  const addNewName = (event) => {
    setNewName(event.target.value)
  }

  const addNewNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const addNewTerm = (event) => {
    setNewTerm(event.target.value)
  }

  const handleDelete = (id) => {
    const personToDelete = persons.find(person => person.id === id)
    if (window.confirm(`Delete ${personToDelete.name}?`)) {
      personService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
        .catch(() => {
          console.log('fail')
        })
    }
  }



  const personsToShow = persons.filter(person => !term || person.name.toUpperCase().includes(term.toUpperCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <NotificationSuccess message={messageSuccess}></NotificationSuccess>
      <NotificationError message={messageError}/>
      <Filter term={term} addNewTerm={addNewTerm} />
      <h2>add a new</h2>
      <PersonForm onSubmitFunc={addPerson} newName={newName} addNewName={addNewName}
        newNumber={newNumber} addNewNumber={addNewNumber} />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} handleDelete={handleDelete} />
    </div>
  )
}

export default App