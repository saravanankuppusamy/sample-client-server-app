import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CharacterButton from "./CharacterButton";
import FilmButton from "./FilmButton";

const Planet = () => {
  const { id } = useParams();
  const [planet, setPlanet] = useState(null);
  const [characters, setCharacters] = useState(null);
  const [films, setFilms] = useState(null);

  useEffect(() => {
    const fetchPlanet = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SWAPI_PLANETS}/${id}`
        );
        if (!response.ok) {
          throw new Error("planet not found");
        }
        const planetData = await response.json();
        setPlanet(planetData);
      } catch (error) {
        console.error("Error fetching planet:", error);
      }
    };

    fetchPlanet();
  }, [id]);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        if (!planet) return;
        const response = await fetch(
          `${import.meta.env.VITE_SWAPI_PLANETS}/${id}/characters`
        );
        if (!response.ok) {
          throw new Error("Characters not found");
        }
        const charactersData = await response.json();

        const characters = await Promise.all(
          charactersData.map(async (characterInfo) => {
            const characterResponse = await fetch(
              `${import.meta.env.VITE_SWAPI_CHARACTERS}/${characterInfo.id}`
            );
            if (!characterResponse.ok) {
              throw new Error(
                `Character details not found for ${
                  import.meta.env.VITE_SWAPI_CHARACTERS
                }/${characterInfo.id}`
              );
            }
            const characterData = await characterResponse.json();
            return characterData;
          })
        );
        console.log(characters);
        setCharacters(characters);
      } catch (error) {
        console.error("Error fetching characters:", error);
      }
    };

    fetchCharacters();
  }, [id, planet]);

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        if (!planet) return;
        const response = await fetch(
          `${import.meta.env.VITE_SWAPI_PLANETS}/${id}/films`
        );
        if (!response.ok) {
          throw new Error("Films not found");
        }
        const filmsData = await response.json();

        const films = await Promise.all(
          filmsData.map(async (filmInfo) => {
            const filmResponse = await fetch(
              `${import.meta.env.VITE_SWAPI_FILMS}/${filmInfo.film_id}`
            );
            if (!filmResponse.ok) {
              throw new Error(
                `Film details not found for ${
                  import.meta.env.VITE_SWAPI_FILMS
                }/${filmInfo.film_id}`
              );
            }
            const filmData = await filmResponse.json();
            return filmData;
          })
        );
        console.log(films);
        setFilms(films);
      } catch (error) {
        console.error("Error fetching films:", error);
      }
    };

    fetchFilms();
  }, [id, planet]);

  if (!planet) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1 id="name">{planet.name}</h1>
      <section id="generalInfo">
        <p>
          Climate: <span id="climate">{planet.climate}</span>
        </p>
        <p>
          Terrain: <span id="terrain">{planet.terrain}</span>
        </p>
        <p>
          Population: <span id="population">{planet.population}</span>
        </p>
      </section>
      {characters && characters.length > 0 && (
        <section id="characters">
          <h2>Residents</h2>
          {characters.map((character) => (
            <CharacterButton key={character._id} data={character} />
          ))}
        </section>
      )}
      {films && films.length > 0 && (
        <section id="films">
          <h2>Films</h2>
          {films.map((film) => (
            <FilmButton key={film._id} data={film} />
          ))}
        </section>
      )}
    </>
  );
};

export default Planet;
