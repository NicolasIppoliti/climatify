import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HourlyWeather = () => {
    // const [city, setCity] = useState('');
    const APIkey = '2651f08b94c06a57dfeac2a55c2ca245';
    // const hourlyUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIkey}&units=metric&lang=es&cnt=9`;

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
            axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${location.latitude}&lon=${location.longitude}&units=metric&appid=${APIkey}&lang=es&cnt=9`)
            .then(res => {
                setWeather(res.data);
                // console.log(res.data);
            })
        }
    }, [location]);

return (
    <div>
        {weather.list && weather.list.map((hour, index) => (
            <div className='grid grid-cols-5 gap-12 items-center justify-center h-fit w-full border-solid border border-gray-50 border-opacity-10 border-x-0' key={index}>
                <h6 className='text-base'>{(hour.dt_txt).slice(11,13)}</h6>
                <div className='text-xs my-2 col-span-2'>
                    <img className='ml-7' width={40} src={`http://openweathermap.org/img/w/${hour.weather[0].icon}.png`} alt="weather icon" />
                    <span className='uppercase'>{(hour.weather[0].description).slice(0,1)}</span>
                    <span>{(hour.weather[0].description).slice(1)}</span>
                </div>
                <div className='text-sm'>
                    <h5>{(hour.main.temp_min).toFixed(0)}°</h5>
                    <span className='text-xs'>Min.</span>
                </div>
                <div className='text-sm'>
                    <h5>{(hour.main.temp_max).toFixed(0)}°</h5>
                    <span className='text-xs'>Max.</span>
                </div>
            </div>
        ))}
    </div>
)}

export default HourlyWeather