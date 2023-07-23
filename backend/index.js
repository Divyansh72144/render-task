const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors"); //authorize
require("dotenv").config();
app.use(express.json());
app.use(cors());
app.use(express.static("build"));
const password = process.argv[2];

const uri = `mongodb+srv://Divyansh:${password}@divyansh.jvjpnhx.mongodb.net/phonebook?retryWrites=true&w=majority`;

const Person = require("./models/person");

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
  Person.find({}).then((people) => {
    response.json(people);
  });
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
  const id = request.params.id;
  Person.findById(id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).json({ error: "Person not found" });
      }
    })
    .catch((error) => {
      response.status(400).json({ error: "Invalid ID format" });
    });

  // const id = Number(request.params.id);
  // const person = persons.find((person) => {
  //   console.log(person.id, typeof person.id, id, typeof id, person.id === id);
  //   return person.id === id;
  // });
  // if (person) {
  //   response.json(person);
  // } else {
  //   response.status(404).end();
  // }
  // Person.findById(request.params.id).then((person) => {
  //   response.json(person);
  // });
});

app.delete("/api/persons/:id", (request, response) => {
  // const id = Number(request.params.id);
  // persons = persons.filter((person) => person.id !== id);

  // response.status(204).end();
  const id = request.params.id;
  Person.findByIdAndRemove(id)
    .then((removedPerson) => {
      if (removedPerson) {
        response.status(204).end();
      } else {
        response.status(404).json({ error: "Person not found" });
      }
    })
    .catch((error) => {
      console.error("error deleting person", error);
      response.status(500).json({ error: "Failed to delete the person" });
    });
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  }
  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => {
      response.status(500).json({ error: "Failed to save the person", error });
    });
  // persons.push(person);

  // response.json(person);

  // person.save().then((savedPerson) => {
  //   response.json(savedNote);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
