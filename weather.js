document.addEventListener('DOMContentLoaded', () => {
    const input = document.querySelector("#city");
    const searchButton = document.querySelector("#search");
    const output = document.querySelector(".weather-info");
    const URL = "https://api.openweathermap.org/data/2.5/weather?q=";
    const apiKey = "38c811c02f38352080c773bcc64f6a13";

    // Weather condition-based background images
    const weatherBackgrounds = {
        clear: 'images/clear.jpg',
        clouds: 'images/cloudy.jpg',
        rain: 'images/rainy.jpg',
        snow: 'images/snowy.jpg',
        fog: 'images/foggy.jpg',
        thunderstorm: 'images/thunderstorm.jpg',
        default: 'images/default.jpg'
    };

    // Day and Night Images
    const dayImage = 'images/day.png';
    const nightImage = 'images/night.png';

    // Load default weather for a predefined city
    fetchWeather("Pokhara");

    // Search button event listener
    searchButton.addEventListener("click", (event) => {
        event.preventDefault();
        const city = input.value.trim();
        if (city) {
            fetchWeather(city);
        }
    });

    async function fetchWeather(cityName) {
        try {
            const apiResponse = await fetch(`${URL}${cityName}&appid=${apiKey}&units=metric`);
            const data = await apiResponse.json();
            if (data.cod === 200) {
                displayWeather(data);
            } else {
                output.innerHTML = `<p><strong>City not found. Please try again.</strong></p>`;
            }
        } catch (error) {
            console.error("Error fetching weather data:", error);
            output.innerHTML = `<p><strong>Unable to fetch weather data. Please check your connection.</strong></p>`;
        }
    }

    function displayWeather(data) {
        const { main, weather, name, sys, visibility, wind, timezone } = data;
        const temperature = main.temp.toFixed(0);
        const humidity = main.humidity;
        const weatherDescription = weather[0].description;
        const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}.png`;
        const windSpeed = wind.speed;
        const visibilityKm = visibility / 1000;
        const date = new Date();
        const utcOffset = timezone / 3600;
        const localTime = new Date(date.getTime() + timezone * 1000);
        const hours = localTime.getUTCHours();
        const minutes = localTime.getUTCMinutes().toString().padStart(2, '0');
        const isDayTime = hours >= 6 && hours < 18; // Define day as 6 AM to 6 PM
        const timeImage = isDayTime ? dayImage : nightImage;
        const timeClass = isDayTime ? 'day' : 'night'; // Add class for day or night

        console.log(`Is Day Time: ${isDayTime}, Time Class: ${timeClass}`); // Debugging line

        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const day = days[localTime.getUTCDay()];
        const month = months[localTime.getUTCMonth()];
        const dayOfMonth = localTime.getUTCDate();
        const year = localTime.getUTCFullYear();
        const fullDate = `${day}, ${month} ${dayOfMonth}, ${year}`;
        const localTimeString = `${hours}:${minutes}`;

        const condition = weather[0].main.toLowerCase();
        const backgroundImage = weatherBackgrounds[condition] || weatherBackgrounds.clear;

        document.body.style.backgroundImage = `url('${backgroundImage}')`;

        output.innerHTML = `
            <div class="weather-popup ${timeClass}" style="background-image: url('${timeImage}');">
                <h1>${name}, ${sys.country}</h1>
                <img src="${iconUrl}" alt="${weatherDescription}" />
                <p><strong>Temperature:</strong> <br>
                ${temperature}°C</p><br>
                <p><strong>Condition:</strong><br>
                ${weatherDescription}</p><br>
                <p><strong>Humidity:</strong><br>
                ${humidity}%</p><br>
                <p><strong>Visibility:</strong><br>
                ${visibilityKm}m</p><br>
                <p><strong>Wind Speed:</strong><br>
                ${windSpeed} m/s</p><br>
                <p><strong>${fullDate}</strong></p>
                <p class="local-time">Local Time: ${localTimeString}</p>
            </div>
        `;
    }
});