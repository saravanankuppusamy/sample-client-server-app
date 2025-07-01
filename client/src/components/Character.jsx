import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PlanetButton from "./PlanetButton";
import FilmButton from "./FilmButton";

const Character = () => {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);
  const [homeworld, setHomeworld] = useState(null);
  const [films, setFilms] = useState(null);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SWAPI_CHARACTERS}/${id}`
        );
        if (!response.ok) {
          throw new Error("Character not found");
        }
        const characterData = await response.json();
        setCharacter(characterData);
      } catch (error) {
        console.error("Error fetching character:", error);
      }
    };

    fetchCharacter();
  }, [id]);

  useEffect(() => {
    const fetchHomeworld = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SWAPI_PLANETS}/${character.homeworld}`
        );
        if (!response.ok) {
          throw new Error("Planet not found");
        }
        const homeworldData = await response.json();
        setHomeworld(homeworldData);
      } catch (error) {
        console.error("Error fetching planet:", error);
      }
    };

    if (character) {
      fetchHomeworld();
    }
  }, [character]);

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        if (!character) return;
        const response = await fetch(
          `${import.meta.env.VITE_SWAPI_CHARACTERS}/${id}/films`
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
  }, [id, character]);

  if (!character) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1 id="name">{character.name}</h1>
      <section id="generalInfo">
        <p>
          Height: <span id="height">{character.height}</span> cm
        </p>
        <p>
          Mass: <span id="mass">{character.mass}</span> kg
        </p>
        <p>
          Born: <span id="birth_year">{character.birth_year}</span>
        </p>
      </section>
      {homeworld && (
        <section id="planets">
          <h2>Homeworld</h2>
          <PlanetButton data={homeworld} />
        </section>
      )}
      {films && films.length > 0 && (
        <section id="films">
          <h2>Films appeared in</h2>
          {films.map((film) => (
            <FilmButton key={film._id} data={film} />
          ))}
        </section>
      )}
    </>
  );
};

export default Character;
