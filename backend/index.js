const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors"); //authorize

app.use(express.json());
app.use(cors());
app.use(express.static("build"));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

//new token
morgan.token("postData", (request) => {
  if (request.method == "POST") {
    return JSON.stringify(request.body);
  }
});

app.use(
  morgan(
    ":method :url :status :response-time ms - :res[content-length] :postData"
  )
);
// app.get("/", (request, response) => {
//   response.send("<h1>Hello World!<h1/>");
// });

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  const numberOfPeople = persons.length;
  const date = new Date();
  const infoMessage = `<p>This phone has ${numberOfPeople} people</p><p>The current time is ${date}</p>`;
  response.send(infoMessage);
});
const generateId = () => {
  const minId = 1;
  const maxId = 1000000;
  return Math.floor(Math.random() * (maxId - minId + 1)) + minId;
};
app.get("/api/person/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => {
    console.log(person.id, typeof person.id, id, typeof id, person.id === id);
    return person.id === id;
  });
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const existingPerson = persons.find((person) => person.name === body.name);
  if (existingPerson) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }
  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons.push(person);

  response.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
