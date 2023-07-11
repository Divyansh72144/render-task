import personService from "../Services/persons";
import App from "../App";

const addPerson = (
  event,
  {
    persons,
    newName,
    newNumber,
    setPersons,
    setNewName,
    setNewNumber,
    setErrorMessage,
  }
) => {
  event.preventDefault();
  console.log("button clicked", event.target);

  let isDuplicate = false;

  const existingPerson = persons.find((person) => person.name === newName);

  if (existingPerson) {
    const confirmed = window.confirm(
      `${newName} is already in the phonebook. Do you want to update the phone number?`
    );

    if (confirmed) {
      const updatedPerson = { ...existingPerson, number: newNumber };

      personService
        .update(existingPerson.id, updatedPerson)
        .then((response) => {
          setPersons((prevPersons) =>
            prevPersons.map((person) =>
              person.id === existingPerson.id ? response.data : person
            )
          );
          setNewName("");
          setNewNumber("");
        });
    }
  } else {
    persons.forEach((person) => {
      if (person.name === newName) {
        alert(`${newName} is already added to the phonebook`);
        isDuplicate = true;
      }
    });

    if (!isDuplicate) {
      const personObject = {
        name: newName,
        number: newNumber,
      };

      personService.create(personObject).then((response) => {
        setPersons(persons.concat(response.data));
        setNewName("");
        setNewNumber("");
        console.log(personObject);
        setErrorMessage(`Added ${personObject.name}`);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
    }
  }
};

export default addPerson;
