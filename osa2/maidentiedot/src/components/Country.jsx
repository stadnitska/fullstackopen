import Weather from './Weather'

const Country = ({ country }) => {
  return (
    <div>
      <h1>{country.name.common}</h1>

      <div>capital {country.capital[0]}</div>
      <div>area {country.area}</div>

      <h3>languages</h3>
      <ul>
        {Object.values(country.languages).map(lang => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>

      <img
        src={country.flags.png}
        alt={`flag of ${country.name.common}`}
        width="150"
      />

      <Weather capital={country.capital[0]} />
    </div>
  )
}

export default Country
