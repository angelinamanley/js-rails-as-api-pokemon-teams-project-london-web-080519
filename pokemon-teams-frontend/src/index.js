//constants

const BASE_URL = "http://localhost:3000";
const TRAINERS_URL = `${BASE_URL}/trainers/`;
const POKEMONS_URL = `${BASE_URL}/pokemons/`;
const cardCollection = document.getElementById("cards-collection");

// api

let API = { get, destroy, post };

function get(url) {
  return fetch(url).then(resp => resp.json());
}

function destroy(url, id) {
  return fetch(`${url}${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  });
}

function post(url, data) {
  return fetch(`${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(data)
  }).then(response => response.json());
}

document.addEventListener("DOMContentLoaded", getCards);

// functions

function getCards() {
  API.get(TRAINERS_URL).then(trainers => trainers.forEach(renderCards));
  // API.get(TRAINERS_URL).then(trainers => trainers.forEach(renderCards))
}

function addPokemon(currentTrainer) {
  data = { trainer_id: currentTrainer.id };
  API.post(POKEMONS_URL, data).then(pokemon =>
    renderPokemon(pokemon, currentTrainer)
  );
}

function renderCards(currentTrainer) {
  divTrainer = document.createElement("div");
  divTrainer.setAttribute("class", "card");
  divTrainer.setAttribute("data-id", currentTrainer.id);
  let trainer = currentTrainer.name;
  let trainerP = document.createElement("p");
  trainerP.innerText = trainer;
  divTrainer.append(trainerP);
  cardCollection.append(divTrainer);

  if (currentTrainer.pokemons.length < 6) {
    addButton = document.createElement("button");
    addButton.innerText = "Add Pokemon";
    addButton.setAttribute("data-trainer-id", currentTrainer.id);
    divTrainer.append(addButton);
    addButton.addEventListener("click", () => addPokemon(currentTrainer)); }

    const trainerUl = document.createElement("ul");
    trainerUl.id = `ul-trainer-${currentTrainer.id}`;
    divTrainer.append(trainerUl);
    pokemons = currentTrainer.pokemons;
    pokemons.forEach(pokemon => {
      renderPokemon(pokemon, currentTrainer);
    });
}

function renderPokemon(pokemon, currentTrainer) {
  let pokemonLi = document.createElement("li");
  pokemonLi.innerText = `${pokemon.nickname}(${pokemon.species})`;
  pokemonLi.id = `pokemon-${pokemon.id}`;
  releaseButton = document.createElement("button");
  releaseButton.innerText = "Release";
  releaseButton.id = `data-pokemon-${pokemon.id}`;
  releaseButton.className = "release";
  ulNew = document.querySelector(`#ul-trainer-${currentTrainer.id}`);
  ulNew.append(pokemonLi, releaseButton);
  releaseButton.addEventListener("click", () => releasePokemon(pokemon.id));
}

function releasePokemon(pokemonId) {
  API.destroy(POKEMONS_URL, pokemonId).then(removePokemon(pokemonId));
}

function removePokemon(id) {
  deletePokeLi = document.querySelector(`#pokemon-${id}`);
  deletePokeLi.parentNode.removeChild(deletePokeLi);
  deleteButton = document.querySelector(`#data-pokemon-${id}`);
  deleteButton.parentNode.removeChild(deleteButton);
}
