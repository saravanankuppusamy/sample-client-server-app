import { useState, useEffect } from 'react';
import CharacterButton from './CharacterButton';

const Home = () => {
  const [data, setData] = useState([]);
  const [searchString, setSearchString] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_SWAPI_CHARACTERS);
        if (!response.ok) {
          throw new Error('Data could not be fetched!');
        }
        const json_response = await response.json();
        setData(json_response); // assign JSON response to the data variable.
      } catch (error) {
        console.error('Error fetching records: ', error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (event) => {
    setSearchString(event.target.value);
  };

  const filteredCharacters = data.filter((character) =>
    character.name.toLowerCase().includes(searchString.toLowerCase())
  );

  return (
    <>
      <h1>Star Wars Universe Lookup</h1>
      <label htmlFor="searchString">
        Who you looking for?{' '}
        <span className="small">(Regular expressions are cool here)</span>
      </label>
      <input
        id="searchString"
        value={searchString}
        onChange={handleInputChange}
        autoComplete="off"
      />
      <section id="charactersList">
        {filteredCharacters.map((character) => (
          <CharacterButton key={character._id} data={character} />
        ))}
      </section>
    </>
  );
};

export default Home;
