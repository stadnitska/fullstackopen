import { useEffect, useState } from 'react'
import axios from 'axios'

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState(null)
  const apiKey = import.meta.env.VITE_WEATHER_KEY
console.log('API KEY:', apiKey)


  useEffect(() => {
    if (!apiKey) return

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`
      )
      .then(response => {
        setWeather(response.data)
      })
      .catch(error => {
        console.error('Weather error:', error)
      })
  }, [capital, apiKey])

  if (!weather) return null

  return (
    <div>
      <h3>Weather in {capital}</h3>
      <div>temperature {weather.main.temp} Celsius</div>
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt="weather icon"
      />
      <div>wind {weather.wind.speed} m/s</div>
    </div>
  )
}

export default Weather
