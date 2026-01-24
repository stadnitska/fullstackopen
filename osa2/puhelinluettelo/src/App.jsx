import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  // LOAD DATA FROM SERVER
  useEffect(() => {
    personService.getAll().then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])

  // ADD OR UPDATE PERSON
  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(
      p => p.name.toLowerCase() === newName.toLowerCase()
    )

    // UPDATE EXISTING
    if (existingPerson) {
      const ok = window.confirm(
        `${existingPerson.name} is already added to phonebook, replace the old number with a new one?`
      )

      if (!ok) return

      const updatedPerson = {
        ...existingPerson,
        number: newNumber,
      }

      personService
        .update(existingPerson.id, updatedPerson)
        .then(returnedPerson => {
          setPersons(
            persons.map(p =>
              p.id !== existingPerson.id ? p : returnedPerson
            )
          )
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          const message =
            error.response?.data?.error || 'Error updating person'

          setErrorMessage(message)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })

      return
    }

    // CREATE NEW
    const personObject = {
      name: newName,
      number: newNumber,
    }

    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        const message =
          error.response?.data?.error || 'Error adding person'

        setErrorMessage(message)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  // DELETE PERSON
  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id)
    if (!person) return

    const ok = window.confirm(`Delete ${person.name}?`)
    if (!ok) return

    personService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(p => p.id !== id))
      })
  }

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      {errorMessage && (
        <div className="error">
          {errorMessage}
        </div>
      )}

      <h2>Phonebook</h2>

      <Filter
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />

      <h2>Add a new</h2>

      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        handleNameChange={e => setNewName(e.target.value)}
        newNumber={newNumber}
        handleNumberChange={e => setNewNumber(e.target.value)}
      />

      <h2>Numbers</h2>

      <Persons
        persons={personsToShow}
        deletePerson={deletePerson}
      />
    </div>
  )
}

export default App
