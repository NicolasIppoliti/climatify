import React, { useState, useEffect } from 'react';
import axios from 'axios';

function WeatherContainer() {

    const [city, setCity] = useState('');
    const APIkey = '2651f08b94c06a57dfeac2a55c2ca245';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}&units=metric`;

    const GeoLocation = () => {
        const [location, setLocation] = useState({});
        const [error, setError] = useState(null);
        
        const onSuccess = (location) => {
            setLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
        };

        const onError = (error) => {
            setError(error.message);
        };

        useEffect(() => {
            if (!navigator.geolocation) {
                setError('Geolocation is not supported by your browser');
                return;
            }

            navigator.geolocation.getCurrentPosition(onSuccess, onError);
        }, []);

        return { location, error };
    };

    const { location } = GeoLocation();

    const [weather, setWeather] = useState({});
    
    useEffect(() => {
        if (location.latitude && location.longitude) {
            axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&units=metric&appid=${APIkey}`)
            .then(res => {
                setWeather(res.data);
            })
        }
    }, [location]);

    const day = new Date();

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.get(url)
        .then(res => {
            setWeather(res.data);
        })
    }

    const handleChange = (e) => {
        setCity(e.target.value);
    }

    const handleKeypress = e => {
        if (e.charCode === 13) {
            e.preventDefault();
            axios.get(url)
            .then(res => {
            setWeather(res.data);
            })
        }
    }

    return (
        <div>
            <input type="text" value={city} onChange={handleChange} onKeyPress={handleKeypress} />
            <button onClick={(handleSubmit)}>Search</button>
            <div>
                {weather.main && (
                    <div className='text-center justify-center align-middle flex'>
                        <h2>{weather.name}</h2>
                        <h3>{weather.main.temp}°C</h3>
                        <h3>{weather.weather[0].description}</h3>
                        <h3>{days[day.getDay()]}, {months[day.getMonth()]} {day.getDate()}, {day.getFullYear()}</h3>
                        <h3>{weather.description}</h3>
                        <img src={`http://openweathermap.org/img/w/${weather.weather[0].icon}.png`} alt="weather icon" />
                        <h3>Feels like {weather.main.feels_like}°C</h3>
                        <h3>Humidity: {weather.main.humidity}%</h3>
                        <h3>Wind: {weather.wind.speed} m/s</h3>
                        <h3>Sunrise: {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}</h3>
                        <h3>Sunset: {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}</h3>
                        <h3>Min: {weather.main.temp_min}°C</h3>
                        <h3>Max: {weather.main.temp_max}°C</h3>
                        <h3>Pressure: {weather.main.pressure} hPa</h3>
                    </div>
                )}
            </div>
        </div>
    )
}

export default WeatherContainer;