import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HourlyWeather from './HourlyWeather/HourlyWeather';

function WeatherContainer() {

    // const [city, setCity] = useState('');
    const APIkey = '2651f08b94c06a57dfeac2a55c2ca245';
    // const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}&units=metric&lang=es`;

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
            axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&units=metric&appid=${APIkey}&lang=es`)
            .then(res => {
                setWeather(res.data);
                console.log(res.data);
            })
        }
    }, [location]);

    // const day = new Date();

    // const days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
    // const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     axios.get(url)
    //     .then(res => {
    //         setWeather(res.data);
    //     })
    // }

    // const handleChange = (e) => {
    //     setCity(e.target.value);
    // }

    // const handleKeypress = e => {
    //     if (e.charCode === 13) {
    //         e.preventDefault();
    //         axios.get(url)
    //         .then(res => {
    //         setWeather(res.data);
    //         })
    //     }
    // }

    const background = {
        backgroundImage: `url(https://source.unsplash.com/1600x900/?${weather.weather && weather.weather[0].main})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100%',
        width: '100%',
        zIndex: '-1',
        top: '0',
        left: '0',
        opacity: '0.8',
    }

    return (
        <div style={background}>
            {weather.main && (
            <div className='mt-16 sm:grid sm:overflow-hidden sm:grid-cols-3 sm:grid-rows-2 sm:gap-2'>
                <div className='sm:box sm:row-span-2'>
                    <div className=''>
                        <h1 className='text-4xl'>{weather.name}</h1>
                    </div>
                    <div className='font-light mb-1'>
                        <h1 className='text-8xl ml-8'>{(weather.main.temp).toFixed(0)}°</h1>
                    </div>
                    <div className='text-lg'>
                        <span className='uppercase'>{(weather.weather[0].description).slice(0,1)}</span>
                        <span>{(weather.weather[0].description).slice(1)}</span>
                    </div>
                    <div>
                        <span className='text-lg'>Max.: {(weather.main.temp_max).toFixed(0)}° Min.: {(weather.main.temp_min).toFixed(0)}°</span>
                    </div>
                </div>
                <div className='m-5 p-5 grid border-2 border-hidden rounded-lg bg-black bg-opacity-25 justify-center sm:box sm:col-start-2 sm:col-span-2'>
                    <h5 className='text-sm mb-3'>PRONOSTICO PARA LAS PROXIMAS HORAS</h5>
                    <HourlyWeather/>
                </div>
                <div className='m-5 p-5 grid grid-cols-2 border-2 border-hidden rounded-lg bg-black bg-opacity-25 justify-center sm:box sm:col-start-2 sm:col-span-2'>
                    <div className='col-span-1'>
                        <h5 className='text-sm mb-3'>ATARDECER</h5>
                        <div>
                            <h5 className='text-lg'>{(weather.sys.sunset).slice(11,16)}</h5>
                            <h5 className='text-sm'>Amanecer: {(weather.sys.sunrise).slice(11,16)}</h5>
                        </div>
                    </div>
                </div>
            </div>
            )}
        </div>
    )};

export default WeatherContainer;