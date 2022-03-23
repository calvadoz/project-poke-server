require("dotenv").config();
const axios = require("axios");
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const { uuid } = require("uuidv4");
const POKEMON_API_URL = "https://pokeapi.co/api/v2/pokemon";

const PORT = process.env.SERVER_PORT || 2000;

app.use(express.json());
app.use("/static", express.static("assets"));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
if (process.env.NODE_ENV === "development") {
  console.log("Morgan enabled");
  app.use(morgan("common"));
}

app.get("/", (req, res) => {
  res.send("Nothing here");
});

app.get("/api/healthcheck", (req, res) => {
  res.send("Service is healthy");
});

app.get("/api/all-pokemons-gen1", async (req, res) => {
  const api_url = POKEMON_API_URL + "?limit=151";
  const pokemons = await axios.get(api_url);
  const results = pokemons.data.results;
  res.send(results);
});

app.get("/api/catchem-all-10", async (req, res) => {
  const api_url = POKEMON_API_URL + "?limit=151";
  const pokemons = await axios.get(api_url);
  const results = pokemons.data.results;
  const randomPokemons = [];

  for (let i = 0; i < 10; i++) {
    const random = generateRandomNumber(151);
    const newResult = { ...results[random] };
    newResult.id = uuid();
    randomPokemons.push(newResult);
  }
  res.send(randomPokemons);
});

function generateRandomNumber(totalPokemons) {
  return Math.ceil(Math.random() * totalPokemons);
}

app.listen(process.env.PORT || 3000, () =>
  console.log("Poke Server is running...")
);
