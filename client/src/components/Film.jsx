import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CharacterButton from "./CharacterButton";
import PlanetButton from "./PlanetButton";

const Film = () => {
  const { id } = useParams();
  const [film, setFilm] = useState(null);
  const [characters, setCharacters] = useState(null);
  const [planets, setPlanets] = useState(null);

  useEffect(() => {
    const fetchFilm = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SWAPI_FILMS}/${id}`
        );
        if (!response.ok) {
          throw new Error("film not found");
        }
        const filmData = await response.json();
        setFilm(filmData);
      } catch (error) {
        console.error("Error fetching film:", error);
      }
    };

    fetchFilm();
  }, [id]);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        if (!film) return;
        const response = await fetch(
          `${import.meta.env.VITE_SWAPI_FILMS}/${id}/characters`
        );
        if (!response.ok) {
          throw new Error("Characters not found");
        }
        const charactersData = await response.json();

        const characters = await Promise.all(
          charactersData.map(async (characterInfo) => {
            const characterResponse = await fetch(
              `${import.meta.env.VITE_SWAPI_CHARACTERS}/${
                characterInfo.character_id
              }`
            );
            if (!characterResponse.ok) {
              throw new Error(
                `Character details not found for ${
                  import.meta.env.VITE_SWAPI_CHARACTERS
                }/${characterInfo.character_id}`
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
  }, [id, film]);

  useEffect(() => {
    const fetchPlanets = async () => {
      try {
        if (!film) return;
        const response = await fetch(
          `${import.meta.env.VITE_SWAPI_FILMS}/${id}/planets`
        );
        if (!response.ok) {
          throw new Error("Planets not found");
        }
        const planetsData = await response.json();

        const planets = await Promise.all(
          planetsData.map(async (planetInfo) => {
            const planetResponse = await fetch(
              `${import.meta.env.VITE_SWAPI_PLANETS}/${planetInfo.planet_id}`
            );
            if (!planetResponse.ok) {
              throw new Error(
                `Planet details not found for ${
                  import.meta.env.VITE_SWAPI_PLANETS
                }/${planetInfo.planet_id}`
              );
            }
            const planetData = await planetResponse.json();
            return planetData;
          })
        );
        console.log(planets);
        setPlanets(planets);
      } catch (error) {
        console.error("Error fetching planets:", error);
      }
    };

    fetchPlanets();
  }, [id, film]);

  if (!film) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1 id="name">{film.title}</h1>
      <section id="generalInfo">
        <p>
          Released: <span id="released">{film.release_date}</span>
        </p>
        <p>
          Director: <span id="director">{film.director}</span>
        </p>
        <p>
          Episode: <span id="episode">{film.episode_id}</span>
        </p>
      </section>
      {characters && characters.length > 0 && (
        <section id="characters">
          <h2>Characters in Film</h2>
          {characters.map((character) => (
            <CharacterButton key={character._id} data={character} />
          ))}
        </section>
      )}
      {planets && planets.length > 0 && (
        <section id="planets">
          <h2>Planets in Film</h2>
          {planets.map((planet) => (
            <PlanetButton key={planet._id} data={planet} />
          ))}
        </section>
      )}
    </>
  );
};

export default Film;
