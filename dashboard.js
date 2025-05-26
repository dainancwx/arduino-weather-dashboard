const API_KEY = 'YOUR_API_KEY'; // Replace with your OpenWeather API key
const LAT = 37.9811;
const LON = -90.0548;

async function fetchWeatherData() {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${37.981104412392135}&lon=${-90.05484322171593}&exclude=minutely,hourly,alerts&units=imperial&appid=${e206db49c3fd97a44f2e622d697c0bd7}`
    );
    const data = await response.json();

    if (data.cod === 401) {
      document.getElementById('forecast').innerHTML = `<p style="color:red;">Invalid API key</p>`;
      return;
    }

    const current = data.current;
    document.getElementById("tempValue").textContent = `${current.temp.toFixed(1)}°F`;
    document.getElementById("pressureValue").textContent = `Pressure: ${current.pressure} hPa`;
    document.getElementById("humidityValue").textContent = `Humidity: ${current.humidity}%`;
    document.querySelector("#windSpeedCard span").textContent = current.wind_speed.toFixed(1);
    document.querySelector("#windDirCard span").textContent = current.wind_deg.toFixed(0);

    const now = new Date();
    const hour = now.getHours() % 12 || 12;
    const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
    const formatted =
      now.getFullYear() + "-" +
      String(now.getMonth() + 1).padStart(2, '0') + "-" +
      String(now.getDate()).padStart(2, '0') + " " +
      hour + ":" +
      String(now.getMinutes()).padStart(2, '0') + ":" +
      String(now.getSeconds()).padStart(2, '0') + " " + ampm;

    document.getElementById("lastUpdated").textContent = `Last Updated: ${formatted}`;

    renderForecast(data.daily);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    document.getElementById("forecast").innerHTML = `<p style="color:red;">Error fetching forecast data.</p>`;
  }
}

function renderForecast(dailyData) {
  const forecastContainer = document.getElementById("forecast");
  forecastContainer.innerHTML = "";

  dailyData.slice(0, 7).forEach((day) => {
    const date = new Date(day.dt * 1000);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    const icon = day.weather[0].icon;
    const desc = day.weather[0].description;
    const max = Math.round(day.temp.max);
    const min = Math.round(day.temp.min);

    const card = document.createElement("div");
    card.className = "forecast-day";
    card.innerHTML = `
      <div><strong>${dayName}</strong></div>
      <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}" />
      <div>${desc}</div>
      <div>🔺 ${max}°F</div>
      <div>🔻 ${min}°F</div>
    `;
    forecastContainer.appendChild(card);
  });
}

function updateLiveTime() {
  const now = new Date();
  const hour = now.getHours() % 12 || 12;
  const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
  const timeStr =
    String(hour).padStart(2, "0") + ":" +
    String(now.getMinutes()).padStart(2, "0") + ":" +
    String(now.getSeconds()).padStart(2, "0") + " " + ampm;
  document.getElementById("liveTime").textContent = timeStr;
}

// Initialize
fetchWeatherData();
updateLiveTime();
setInterval(fetchWeatherData, 10000); // every 10 sec
setInterval(updateLiveTime, 1000);    // every second
