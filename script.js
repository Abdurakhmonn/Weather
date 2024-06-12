document.getElementById('weatherForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var city = document.getElementById('city').value;
    getWeather(city);
});

function getWeather(city) {
    var apiKey = '8ce260f06685a259c9d2e2fac26d0755'; // Замените 'YOUR_API_KEY' на ваш реальный API ключ OpenWeatherMap
    var weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=ru`;
    var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=ru`;

    Promise.all([
        fetch(weatherUrl).then(response => response.json()),
        fetch(forecastUrl).then(response => response.json())
    ])
    .then(([weatherData, forecastData]) => {
        if (weatherData.cod === 200 && forecastData.cod === "200") {
            displayWeather(weatherData, city);
            displayForecast(forecastData);
        } else {
            alert('Город не найден');
        }
    })
    .catch(error => {
        console.error('Ошибка:', error);
        alert('Не удалось получить данные о погоде');
    });
}

function displayWeather(weatherData, city) {
    var weatherResult = document.getElementById('weatherResult');
    var iconCode = weatherData.weather[0].icon;
    var iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;
    weatherResult.innerHTML = `
        <div class="current-weather">
            <h2>Текущая погода в ${city}:</h2>
            <div class="weather-info">
                <div>Температура: ${weatherData.main.temp}°C</div>
                <div>Ощущается как: ${weatherData.main.feels_like}°C</div>
                <div>Влажность: ${weatherData.main.humidity}%</div>
                <div class="description">
                    <span>Описание:</span>
                    <span>${weatherData.weather[0].description}</span>
                    <img src="${iconUrl}" alt="Погодные условия">
                </div>
            </div>
        </div>
    `;
}

function displayForecast(forecastData) {
    var weatherResult = document.getElementById('weatherResult');
    weatherResult.innerHTML += `
        <h2>Прогноз на неделю:</h2>
        <div class="forecast-list">
            ${forecastData.list.map(item => `
                <div class="forecast-item">
                    <div class="forecast-date">${formatDate(new Date(item.dt * 1000))}</div>
                    <div class="forecast-description">${item.weather[0].description} <img src="http://openweathermap.org/img/w/${item.weather[0].icon}.png" alt="Погодные условия"></div>
                    <div class="forecast-temp">${item.main.temp}°C</div>
                </div>
            `).join('')}
        </div>
    `;
}

function formatDate(date) {
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('ru-RU', options);
}
