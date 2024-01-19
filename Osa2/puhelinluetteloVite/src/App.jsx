import { useState, useEffect } from 'react'
import axios from 'axios';


const Filter = ({ filter, handleFilter }) => (
  <div>
    Filter shown with: <input value={filter} onChange={handleFilter} />
  </div>
);

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
);

const Persons = ({ persons, filter }) => (
  <div>
    {persons
      .filter((person) =>
        person.name.toLowerCase().includes(filter.toLowerCase()))
      .map((person, index) => (
        <div key={index}>
          {person.name} {person.number}
        </div>
      ))}
  </div>
);

const App = () => {

  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }, [])
  console.log('render', notes.length, 'notes')

  const addPerson = (event) => {
    event.preventDefault();
    const isNameInList = persons.some((person) => person.name === newName);
    if (isNameInList) {
      alert(`${newName} is already added to phonebook`);
      return;
    }
    const newPerson = { name: newName, number: newNumber };
    setPersons(persons.concat(newPerson));
    setNewName('');
    setNewNumber('');
  };

  const handleNewPerson = (event) => {
    setNewName(event.target.value);
  };

  const handleNewNumber = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilter = (event) => {
    setFilter(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
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
      <Persons persons={persons} filter={filter} />
    </div>
  );
};

export default App;
