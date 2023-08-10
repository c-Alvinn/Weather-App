const apiKey = '47d0a07132a16d424366e376118482b6';
const locButton = document.querySelector('.loc-button');
const todayInfo = document.querySelector('.today-info');
const todayWeatherIcon = document.querySelector('.today-weather i');
const todayTemp = document.querySelector('.weather-temp');
const daysList = document.querySelector('.days-list');

// Mapping of weather condition codes to icon class names (Depending on Openweather Api Respons)
const weatherIconMap = {
    '01d': 'sun',
    '01n': 'moon',
    '02d': 'sun',
    '02n': 'moon',
    '03d': 'cloud',
    '03n': 'cloud',
    '04d': 'cloud',
    '04n': 'cloud',
    '09d': 'cloud-rain',
    '09n': 'cloud-rain',
    '10d': 'cloud-rain',
    '10n': 'cloud-rain',
    '11d': 'cloud-lighting',
    '11n': 'cloud-lighting',
    '13d': 'cloud-snow',
    '13n': 'cloud-snow',
    '50d': 'water',
    '50n': 'water'
};

function fetchWeaatherData(location){
    // Construct the API url with the location andapi key
    const apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + location + '&appid=' +  apiKey + '&units=metric';

    // Fetch weather data from api
    fetch(apiUrl).then(response => response.json()).then(data =>{
        // Update today info
        const todayWeather = data.list[0].weather[0].description;
        const todayTemperature = Math.round(data.list[0].main.temp) + '°C';
        const todayWeatherIconCode = data.list[0].weather[0].icon;
        todayInfo.querySelector('h2').textContent = new Date().toLocaleDateString('en', {weekday: 'long'});
        todayInfo.querySelector('span').textContent = new Date().toLocaleDateString('en', {day: 'numeric', month: 'long', year: 'numeric'});
        todayWeatherIcon.className = 'bx bx-' + weatherIconMap[todayWeatherIconCode];
        todayTemp.textContent = todayTemperature;

        // Update location and weather description in the 'lest-info' section
        const locationElement = document.querySelector('.today-info > div > span');
        locationElement.textContent = data.city.name + ', ' + data.city.country;

        const weatherDescriptionElement = document.querySelector('.today-weather > h3');
        weatherDescriptionElement.textContent = todayWeather;

        // Update todays info in the "day-info" section
        const todayPrecipitation = data.list[0].pop + '%';
        const todayHumidity = data.list[0].main.humidity + '%';
        const todayWindSpeed = data.list[0].wind.speed + ' km/h';

        const dayInfoContainer = document.querySelector('.day-info');
        dayInfoContainer.innerHTML = '<div><span class="tittle">PRECIPITATION</span><span class="value">' +  todayPrecipitation + '</span></div><div><span class="tittle">HUMIDITY</span><span class="value">' + todayHumidity + '</span></div><div><span class="tittle">WIND SPEED</span><span class="value">' + todayWindSpeed + '</span></div>';

        // Update next 4 days weather
        const today = new Date();
        const nextDaysData = data.list.slice(1);

        const uniqueDays = new Set();
        let conut = 0;
        daysList.innerHTML = '';
        for(const dayData of nextDaysData){
            const forecastDate = new Date(dayData.dt_txt);
            const dayAbbreviation = forecastDate.toLocaleDateString('en', {weekday: 'short'});
            const dayTemp = Math.round(dayData.main.temp) + '°C';
            const iconCode = dayData.weather[0].icon;

            //Ensure the day isn't duplicate and today
            if(!uniqueDays.has(dayAbbreviation) && forecastDate.getDate() !== today.getDate()){
                uniqueDays.add(dayAbbreviation);
                daysList.innerHTML += '<li><i class="bx bx-' + weatherIconMap[iconCode] + '"></i><span>' + dayAbbreviation + '</span><span class="day-temp">' + dayTemp + '</span></li>';
                conut++;
            }

            // Stop after getting 4 distinct days
            if(conut === 4) break;
        }

    }).catch(error =>{
        alert('Error fetching weather data: '+ error + '} (Api Error)');
    });
};

// Fetch weather data on document load for default location (Germany)
document.addEventListener('DOMContentLoaded', () =>{
    const defaultLocation = 'Brazil';
    fetchWeaatherData(defaultLocation);
});

locButton.addEventListener('click', () =>{
    const location = prompt('Enter a location: ');
    if(!location) return;

    fetchWeaatherData(location);
});