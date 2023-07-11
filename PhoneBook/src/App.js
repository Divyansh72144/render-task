import { useState, useEffect } from "react";
import FilteredPersons from "./components/FilteredPerson";
import addPerson from "./components/Adding";
import personService from "./Services/persons";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456", id: 1 },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  ]);

  useEffect(() => {
    personService.getAll().then((response) => {
      setPersons(response.data);
    });
  }, []);

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("some error happened");

  const Notification = ({ message }) => {
    if (message === null) {
      return null;
    }
    return (
      <div className={message.includes("Error") ? "error" : "success"}>
        {message}
      </div>
    );
  };

  const handlePersonChange = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value); // Input field
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const handleUpdate = (id) => {
    personService
      .update(id)
      .then(() => {
        setPersons((prevPersons) =>
          prevPersons.map((person) =>
            person.id === id ? { ...person, updated: true } : person
          )
        );

        setTimeout(() => {
          // Access the updated persons state here
          if (!persons.some((person) => person.id === id)) {
            setErrorMessage("Person has been removed from the server.");
            setTimeout(() => {
              setErrorMessage(null);
            }, 5000);
          }
        }, 0);
      })
      .catch((error) => {
        setErrorMessage(`Error updating the person: ${error.message}`);
      });
  };

  const handleDelete = (id) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this?"
    );
    if (shouldDelete) {
      personService
        .remove(id)
        .then(() => {
          setPersons((prevPersons) =>
            prevPersons.filter((person) => person.id !== id)
          );
          setErrorMessage(`Person with ID ${id} deleted successfully.`); // Set success message
          setTimeout(() => {
            setErrorMessage(null); // Clear the message after 5 seconds
          }, 5000);
        })
        .catch((error) => {
          setErrorMessage(
            `Error deleting the person from the server: ${error.message}`
          ); // Set error message
        });
    }
  };
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} />
      <div>
        Search:
        <input value={searchQuery} onChange={handleSearchChange} />
        <FilteredPersons
          persons={persons}
          searchQuery={searchQuery}
          handleSearchChange={handleSearchChange}
          handleRemove={handleDelete}
          handleUpdates={handleUpdate}
        />
      </div>
      <form
        onSubmit={(event) =>
          addPerson(event, {
            persons,
            newName,
            newNumber,
            setPersons,
            setNewName,
            setNewNumber,
            setErrorMessage,
          })
        }
      >
        <div>
          name:
          <input value={newName} onChange={handlePersonChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  );
};

export default App;
