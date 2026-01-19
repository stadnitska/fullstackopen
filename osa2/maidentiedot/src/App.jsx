import { useEffect, useState } from 'react'
import axios from 'axios'
import CountryList from './components/CountryList'
import Country from './components/Country'

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => setCountries(response.data))
  }, [])

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  )

  const showCountry = (country) => {
    setSelectedCountry(country)
  }

  let content = null

  if (filteredCountries.length > 10) {
    content = <div>Too many matches, specify another filter</div>
  } else if (filteredCountries.length === 1) {
    content = <Country country={filteredCountries[0]} />
  } else if (selectedCountry) {
    content = <Country country={selectedCountry} />
  } else {
    content = (
      <CountryList
        countries={filteredCountries}
        showCountry={showCountry}
      />
    )
  }

  return (
    <div>
      <div>
        find countries{' '}
        <input
          value={filter}
          onChange={e => {
            setFilter(e.target.value)
            setSelectedCountry(null)
          }}
        />
      </div>

      {content}
    </div>
  )
}

export default App
