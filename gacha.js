const _ = require("lodash");
const getRoll = require("./random");
// Get operators
let pokemons;
const gen1Pokemons = _.groupBy(
  require("./assets/data.json").slice(0, 150),
  (pokemon) => pokemon.rarity
);

const gen2Pokemons = _.groupBy(
  require("./assets/data.json").slice(151, 250),
  (pokemon) => pokemon.rarity
);

const gen3Pokemons = _.groupBy(
  require("./assets/data.json").slice(251, 385),
  (pokemon) => pokemon.rarity
);

const allPokemons = _.groupBy(
  require("./assets/data.json"),
  (pokemon) => pokemon.rarity
);

// Gacha Rates
const GACHA_RATES = {
  UR: 0.02, // 2* = 2%
  SSR: 0.08, // 8* = 8%
  SR: 0.2, // 20* = 50%
  R: 0.7, // 70* = 40%
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
    const roll = getRoll(0, 1, 5);
    console.log(roll);
    const unitRarity = determineRarity(roll);
    console.log(unitRarity);
    const unit = determineUnit(unitRarity);
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
    default:
      genPokemons = allPokemons;
      break;
  }
  return genPokemons;
};

module.exports = rollGacha;
