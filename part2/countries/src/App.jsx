import { useEffect, useState } from "react";
import countriesService from "./services/countries";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    countriesService.getAll().then(({ data }) => {
      setCountries(data);
    });
  }, []);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const filteredCountries = countries.filter((country) => {
    return country.name.common.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <>
      <label htmlFor="search">find countries</label>
      <input
        id="search"
        type="text"
        onChange={handleSearchChange}
        value={search}
      />

      {filteredCountries.length > 10 ? (
        <div>Too many matches, specify another filter</div>
      ) : filteredCountries.length === 1 ? (
        <div>
          <h1>{filteredCountries[0].name.common}</h1>
          <div>capital {filteredCountries[0].capital}</div>
          <div>area {filteredCountries[0].area}</div>
          <h2>languages</h2>
          <ul>
            {Object.values(filteredCountries[0].languages).map((language) => (
              <li key={language}>{language}</li>
            ))}
          </ul>
          <img
            src={filteredCountries[0].flags.png}
            alt={`flag of ${filteredCountries[0].name.common}`}
            width="200"
          />
        </div>
      ) : (
        <div>
          {filteredCountries.map((country) => (
            <div key={country.name.common}>
              {country.name.common}
              <button onClick={() => setSearch(country.name.common)}>
                show
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default App;
