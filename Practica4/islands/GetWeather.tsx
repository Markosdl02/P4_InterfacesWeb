import { useEffect, useState } from "preact/hooks";


interface Weather {
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
}

function WeatherApp() {
    const [cities, setCities] = useState([
        { name: 'Madrid', lat: 40.4168, lon: -3.7038 },
        { name: 'Barcelona', lat: 41.3851, lon: 2.1734 },
        { name: 'Paris', lat: 48.8566, lon: 2.3522 },
        { name: 'New York', lat: 40.7128, lon: -74.0060 },
        { name: 'Tokyo', lat: 35.6895, lon: 139.6917 }
    ]);
    const [selectedCity, setSelectedCity] = useState(cities[0]);
    const [weatherData, setWeatherData] = useState({} as Weather);
    const [showTemperature, setShowTemperature] = useState(true);
    const [showRelativeHumidity, setShowRelativeHumidity] = useState(false);
    const [showWindSpeed, setShowWindSpeed] = useState(false);

    useEffect(() => {
        obtenerDatosMeteorologicos(selectedCity.lat, selectedCity.lon);
    }, [selectedCity]);

    const obtenerDatosMeteorologicos = (lat: number, lon: number) => {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&hourly=temperature_2m`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const weather: Weather = {
                    temperature_2m: data.current.temperature_2m,
                    relative_humidity_2m: data.current.relative_humidity_2m,
                    wind_speed_10m: data.current.wind_speed_10m
                };
                setWeatherData(weather);
            })
            .catch(error => {
                console.error('Error al obtener datos meteorológicos:', error);
            });
    };

    const handleCheckboxChange = (e: any) => {
        const { name, checked } = e.target;
        switch (name) {
            case 'temperature':
                setShowTemperature(checked);
                break;
            case 'relative_humidity':
                setShowRelativeHumidity(checked);
                break;
            case 'wind_speed':
                setShowWindSpeed(checked);
                break;
            default:
                break;
        }
    };

    return (
        <div className="weather-app">
            <h1>Aplicacion Tiempo</h1>
            <div>
                <label htmlFor="city">Selecciona una ciudad:</label>
                <select id="city" value={selectedCity.name} onChange={(e) => {
                    const cityName = e.currentTarget.value;
                    const city = cities.find(city => city.name === cityName);
                    if (city) {
                        setSelectedCity(city);
                    }
                }}>
                    {cities.map((city, index) => (
                        <option key={index} value={city.name}>{city.name}</option>
                    ))}
                </select>
            </div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        name="temperature"
                        checked={showTemperature}
                        onChange={handleCheckboxChange}
                    />
                    Mostrar Temperatura
                </label>
            </div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        name="relative_humidity"
                        checked={showRelativeHumidity}
                        onChange={handleCheckboxChange}
                    />
                    Mostrar Humedad Relativa
                </label>
            </div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        name="wind_speed"
                        checked={showWindSpeed}
                        onChange={handleCheckboxChange}
                    />
                    Mostrar Velocidad del Viento
                </label>
            </div>
            {weatherData && (
                <div className="weather-data">
                    <h2>Datos Meteorológicos</h2>
                    <p>Ciudad: {selectedCity.name}</p>
                    <p>Latitud: {selectedCity.lat}</p>
                    <p>Longitud: {selectedCity.lon}</p>
                    {showTemperature && (
                        <p>Temperatura: {weatherData.temperature_2m} °C</p>
                    )}
                    {showRelativeHumidity && (
                        <p>Humedad Relativa: {weatherData.relative_humidity_2m}%</p>
                    )}
                    {showWindSpeed && (
                        <p>Velocidad del Viento: {weatherData.wind_speed_10m} m/s</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default WeatherApp;