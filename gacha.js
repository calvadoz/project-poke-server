const _ = require("lodash");
const getRoll = require("./random");
// Get operators
let pokemons;
const gen1Pokemons = _.groupBy(
  require("./assets/data.json").slice(0, 151),
  (pokemon) => pokemon.rarity
);

const gen2Pokemons = _.groupBy(
  require("./assets/data.json").slice(151, 251),
  (pokemon) => pokemon.rarity
);

const gen3Pokemons = _.groupBy(
  require("./assets/data.json").slice(251, 385),
  (pokemon) => pokemon.rarity
);

const shinyPokemons = _.groupBy(
  require("./assets/data.json").slice(385, 430),
  (pokemon) => pokemon.rarity
);

const allPokemons = _.groupBy(
  require("./assets/data.json"),
  (pokemon) => pokemon.rarity
);

// Gacha Rates
const GACHA_RATES = {
  SP: 0.005, // 0.5%
  UR: 0.01, // 1%
  SSR: 0.0375, // 3.75%
  SR: 0.1575, // 15.75%
  R: 0.79, // 79%
};

const rollPokemon = (rarity) => {
  const pokemonList = pokemons[rarity];
  const pokemonIndex = getRoll(0, pokemonList.length - 1, 0);
  return pokemonList[pokemonIndex];
};

const determineRarity = (roll) => {
  let checkValue = 0,
    result;

  _.forEach(GACHA_RATES, (rate, rarity) => {
    checkValue += rate;

    if (roll <= checkValue && !result) {
      result = rarity;
    }
  });
  return result;
};

const determineUnit = (rarity) => rollPokemon(rarity);

const rollGacha = (times, gen) => {
  const rollResult = [];
  pokemons = getGen(gen);

  for (let i = 0; i < times; i++) {
    const roll = getRoll(0.0001, 1, 4);
    const unitRarity = determineRarity(roll);
    const unit = determineUnit(unitRarity);
    unit.isShow = false;
    rollResult.push(unit);
  }
  return rollResult;
};

const getGen = (gen) => {
  let genPokemons;
  switch (gen) {
    case "GEN-1":
      genPokemons = gen1Pokemons;
      break;
    case "GEN-2":
      genPokemons = gen2Pokemons;
      break;
    case "GEN-3":
      genPokemons = gen3Pokemons;
      break;
    case "SHINY":
      genPokemons = shinyPokemons;
      break;
    default:
      genPokemons = allPokemons;
      break;
  }
  return genPokemons;
};

module.exports = rollGacha;
