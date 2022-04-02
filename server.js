require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const rollGacha = require("./gacha");
const pokemonApiUrl = process.env.POKEMON_API_URL;
const totalPokemons = process.env.TOTAL_POKEMONS || 151; // Gen-1 151, Gen-2 152-251, Gen-3 252-386

app.use(cors());
app.use(express.json());
app.use("/static", express.static("assets", { maxAge: 3600000 }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === "development") {
  console.log("Morgan enabled");
  app.use(morgan("common"));
}

app.get("/", (req, res) => {
  res.send("Nothing here");
});

app.get("/api/healthcheck", (req, res) => {
  res.send("Service is healthy...");
});

app.get("/api/all-pokemons-gen1", async (req, res) => {
  const gachaResults = rollGacha(6, "GEN-1");
  res.send(gachaResults);
});

app.get("/api/all-pokemons-gen2", async (req, res) => {
  const gachaResults = rollGacha(6, "GEN-2");
  res.send(gachaResults);
});

app.get("/api/all-pokemons-gen3", async (req, res) => {
  const gachaResults = rollGacha(6, "GEN-3");
  res.send(gachaResults);
});

app.get("/api/catchem-all-multi", async (req, res) => {
  const gachaResults = rollGacha(6, "ALL");
  res.send(gachaResults);
});

app.get("/api/catchem-all-single", async (req, res) => {
  res.send(rollGacha(1));
});

app.get("/api/get-version", async (req, res) => {
  res.send(
    process.env.HEROKU_RELEASE_VERSION
      ? process.env.HEROKU_RELEASE_VERSION
      : "development"
  );
});

// app.get("/api/catchem-all-test", async (req, res) => {
//   const api_url = pokemonApiUrl + "?limit=385";
//   const pokemons = await axios.get(api_url);
//   const results = pokemons.data.results;
//   results.forEach((x, index) => {
//     x.id = uuidv4();
//     x.pokemonId = index + 1;
//     x.rarity = 'R';
//   });

//   res.send(results);
// });

function generateRandomNumber(totalPokemons) {
  return Math.ceil(Math.random() * totalPokemons);
}

function randomizePokemons(totalPokemons) {
  const randomPokemons = [];
  for (let i = 0; i < 10; i++) {
    const random = generateRandomNumber(totalPokemons.length);
    const newResult = { ...totalPokemons[random] };
    newResult.id = uuidv4();
    randomPokemons.push(newResult);
  }
  return randomPokemons;
}

app.listen(process.env.PORT || 4000, () =>
  console.log("Poke Server is running...")
);
