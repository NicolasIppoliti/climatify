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
        position: 'relative',
        height: '100%',
        width: '100%',
        zIndex: '-1',
        top: '0',
        left: '0',
        opacity: '0.9',
    }

    const sunset = () => {
        const sunset = new Date(weather.sys.sunset * 1000);
        const sunsetHour = sunset.getHours();
        const sunsetMinutes = "0" + sunset.getMinutes();
        const sunsetTime = sunsetHour + ':' + sunsetMinutes.substr(-2);
        return sunsetTime;
    }

    const sunrise = () => {
        const sunrise = new Date(weather.sys.sunrise * 1000);
        const sunriseHour = sunrise.getHours();
        const sunriseMinutes = "0" + sunrise.getMinutes();
        const sunriseTime = sunriseHour + ':' + sunriseMinutes.substr(-2);
        return sunriseTime;
    }

    const windDirection = () => {
        const windDirection = weather.wind.deg;
        if (windDirection >= 0 && windDirection < 45) {
            return 'Norte';
        } else if (windDirection >= 45 && windDirection < 90) {
            return 'Noreste';
        } else if (windDirection >= 90 && windDirection < 135) {
            return 'Este';
        } else if (windDirection >= 135 && windDirection < 180) {
            return 'Sureste';
        } else if (windDirection >= 180 && windDirection < 225) {
            return 'Sur';
        } else if (windDirection >= 225 && windDirection < 270) {
            return 'Suroeste';
        } else if (windDirection >= 270 && windDirection < 315) {
            return 'Oeste';
        } else if (windDirection >= 315 && windDirection < 360) {
            return 'Noroeste';
        }
    }

    return (
        <div className='w-full h-full' style={background}>
            {weather.main && (
            <div className='pt-10 sm:grid sm:overflow-hidden sm:grid-cols-3 sm:grid-rows-2 sm:gap-2'>
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
                <div className='m-4 p-4 grid border-2 border-hidden rounded-lg bg-black bg-opacity-25 justify-center sm:box sm:col-start-2 sm:col-span-2'>
                    <h5 className='text-sm mb-3'>PRONOSTICO PARA LAS PROXIMAS HORAS</h5>
                    <HourlyWeather/>
                </div>
                <div className='px-4 pb-4 grid grid-cols-2 gap-2 justify-center sm:box sm:col-start-2 sm:col-span-2'>
                    <div className='p-4 col-span-1 border-2 border-hidden rounded-lg bg-black bg-opacity-25'>
                        <h5 className='text-xs mb-2'>VIENTO</h5>
                        <div>
                            <h5 className='text-3xl'>
                                {(weather.wind.speed).toFixed(0)} m/s
                            </h5>
                            <h5 className='text-sm'>{windDirection()}</h5>
                        </div>
                    </div>
                    <div className='p-4 col-span-1 border-2 border-hidden rounded-lg bg-black bg-opacity-25'>
                        <h5 className='text-xs mb-2'>ATARDECER</h5>
                        <div>
                            <h5 className='text-3xl'>{sunset()}</h5>
                            <h5 className='text-sm'>Amanecer: {sunrise()}</h5>
                        </div>
                    </div>
                </div>
            </div>
            )}
        </div>
    )};

export default WeatherContainer;