const FilteredPersons = ({ persons, searchQuery, newName, handleRemove }) => {
  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div>
      {" "}
      <h2>Numbers</h2>
      <ul>
        {filteredPersons.map((person) => (
          <li key={person.name}>
            {person.name}
            {person.number}
            <button onClick={() => handleRemove(person.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <div>debug: {newName}</div>
    </div>
  );
};

export default FilteredPersons;
