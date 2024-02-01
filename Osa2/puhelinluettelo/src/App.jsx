import { useState, useEffect } from 'react'
import phonebook from './services/phonebook'

const Notification = ({message}) => {
  if (message === null){
    return null
  }

  return (
    <div className='notification'>
      {message}
    </div>
  )
}

const Filter = ({ filter, handleFilter }) => (
  <div>
    Filter shown with: <input value={filter} onChange={handleFilter} />
  </div>
)

const PersonForm = ({ newName, newNumber, handleNewPerson, handleNewNumber, addPerson }) => (
  <form onSubmit={addPerson}>
    <div>
      name: <input value={newName} onChange={handleNewPerson} />
      <div>number: <input value={newNumber} onChange={handleNewNumber} /></div>
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Persons = ({ persons, filter, handleDelete }) => (
  <div>
    {persons
      .filter((person) =>
        person.name.toLowerCase().includes(filter.toLowerCase()))
      .map((person, index) => (
        <div key={index}>
          {person.name} {person.number}
          <button onClick={() => handleDelete(person.id)}>Delete</button>
        </div>
      ))}
  </div>
)

const App = () => {

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [addMessage, setAddMessage] = useState(null)

  useEffect(()=>{
    phonebook
    .getAll()
    .then(response => {
      console.log('promise fulfilled')
      setPersons(response.data)
    })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
  
    const existingPerson = persons.find((person) => person.name === newName)
  
    if (existingPerson) {
      const confirmed = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )
  
      if (confirmed) {
        const updatedPerson = { ...existingPerson, number: newNumber }
  
        phonebook
          .replaceNumber(existingPerson.id, updatedPerson)
          .then((response) => {
            setPersons(persons.map((person) => (person.id !== existingPerson.id ? person : response.data)))
            setNewName('')
            setNewNumber('')
          })
          .catch((error) => {
            setAddMessage(
              `${newName} has already beed removed from server`
            )
            setTimeout(() => {
              setAddMessage(null)
            }, 5000)

            console.error("Error replacing number:", error)
          })
      }
  
      return
    }
  
    const newPerson = { name: newName, number: newNumber }
  
    phonebook
      .addContact(newPerson)
      .then((response) => {
        setPersons(persons.concat(response.data))
        setNewName('')
        setNewNumber('')
      })
      .catch((error) => {
        setAddMessage(`Error: ${error.response.data.error}`)
        console.error("Error adding contact:", error)
      })
    setAddMessage(
      `${newName} is added to phonebook`
    )
    setTimeout(() => {
      setAddMessage(null)
    }, 5000)
  }

  const handleNewPerson = (event) => {
    setNewName(event.target.value)
  }

  const handleNewNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilter = (event) => {
    setFilter(event.target.value)
  }

  const handleDelete = (id) =>{
    const person = persons.find(person => person.id === id)
    const confirmed = window.confirm(`Do you really want to delete ${person.name}?`)

    if(confirmed){
      phonebook
      .deleteContact(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))
      })
      .catch(error => {
        console.error("Error deleting contact:", error);
      })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={addMessage} />
      <Filter filter={filter} handleFilter={handleFilter} />
      <h2>Add a new</h2>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNewPerson={handleNewPerson}
        handleNewNumber={handleNewNumber}
        addPerson={addPerson}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} handleDelete={handleDelete} />
    </div>
  )
}

export default App;
