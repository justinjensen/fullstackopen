import { useState, useEffect } from "react";
import personService from "./services/persons";

const Filter = ({ search, handleSearchChange }) => {
  return (
    <div>
      filter shown with <input value={search} onChange={handleSearchChange} />
    </div>
  );
};

const PersonForm = ({
  newName,
  newNumber,
  handleSubmit,
  handleNameChange,
  handleNumberChange,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Persons = ({ persons, deletePerson }) => {
  return (
    <div>
      {persons.map((person) => (
        <div key={person.id}>
          {person.name} {person.number}
          <button onClick={() => deletePerson(person)}>delete</button>
        </div>
      ))}
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    personService.getAll().then((response) => {
      setPersons(response.data);
    });
  }, []);

  const filteredPersons = persons.filter((person) => {
    return person.name.toLowerCase().includes(search.toLowerCase());
  });

  const personsToShow = search === "" ? persons : filteredPersons;

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const addPerson = (event) => {
    event.preventDefault();

    if (persons.find((person) => person.name === newName)) {
      if (
        confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const person = persons.find((person) => person.name === newName);
        const updatedPerson = { ...person, number: newNumber };
        personService.update(person.id, updatedPerson).then((response) => {
          setPersons(
            persons.map((person) =>
              person.id === response.data.id ? response.data : person
            )
          );
        });
      }
      return;
    }

    const newPerson = {
      name: newName,
      number: newNumber,
    };

    personService.create(newPerson).then((response) => {
      setPersons(persons.concat(response.data));
      setNewName("");
      setNewNumber("");
    });
  };

  const deletePerson = (person) => {
    if (confirm(`Delete ${person.name} ?`)) {
      personService.destroy(person.id).then((response) => {
        const deletedPerson = response.data;
        setPersons(persons.filter((p) => p.id !== deletedPerson.id));
      });
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter search={search} handleSearchChange={handleSearchChange} />

      <h2>add a new</h2>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleSubmit={addPerson}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
