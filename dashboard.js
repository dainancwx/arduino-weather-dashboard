const API_KEY = "f9c86aa8266a0d5c15d39ad5ca0b6c7e";
const LAT = 37.9811;
const LON = -90.0548;

async function fetchCurrentData() {
  try {
    const response = await fetch("datalog.csv");
    const text = await response.text();
    const rows = text.trim().split("\n");
    const latest = rows[rows.length - 1].split(",");

    const [timestamp, windSpeed, windDir, hum, pressure, tempF] = latest;

    document.querySelector("#windSpeedValue").textContent = `${parseFloat(windSpeed).toFixed(1)} mph`;
    document.querySelector("#windDirValue").textContent = `${parseFloat(windDir).toFixed(1)} °`;
    document.querySelector("#tempValue").textContent = `${parseFloat(tempF).toFixed(1)}°F`;
    document.querySelector("#pressureValue").textContent = `Pressure: ${parseFloat(pressure).toFixed(1)} hPa`;
    document.querySelector("#humidityValue").textContent = `Humidity: ${parseFloat(hum).toFixed(1)} %`;

    const now = new Date();
    const localTimeStr = formatTime(now);
    const utcTimeStr = formatTime(new Date(now.toUTCString()));

    document.getElementById("lastUpdated").textContent = `Last Updated: ${formatDateTime(now)}`;
    document.getElementById("liveTime").textContent = localTimeStr;
    document.getElementById("zuluTime").textContent = `Zulu Time: ${utcTimeStr} UTC`;
  } catch (err) {
    console.error("Error loading datalog.csv:", err);
  }
}

function formatTime(date) {
  let hours = date.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours.toString().padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")} ${ampm}`;
}

function formatDateTime(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${formatTime(date)}`;
}

async function fetchForecast() {
  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=37.9811&lon=-90.0548&units=imperial&appid=f9c86aa8266a0d5c15d39ad5ca0b6c7e`;
    const response = await fetch(url);
    const data = await response.json();

    const forecastContainer = document.getElementById("forecast");
    forecastContainer.innerHTML = "";

    const forecastsByDay = {};

    data.list.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toISOString().slice(0, 10);
      if (!forecastsByDay[dayKey]) {
        forecastsByDay[dayKey] = [];
      }
      forecastsByDay[dayKey].push(item);
    });

    const days = Object.keys(forecastsByDay).slice(0, 5);
    days.forEach(dayKey => {
      const dayForecasts = forecastsByDay[dayKey];
      const dayName = new Date(dayKey).toLocaleDateString("en-US", { weekday: "short" });

      const dayDiv = document.createElement("div");
      dayDiv.className = "forecast-day";

      const dayTitle = document.createElement("div");
      dayTitle.innerHTML = `<strong>${dayName} (${dayKey})</strong>`;
      dayDiv.appendChild(dayTitle);

      dayForecasts.forEach(item => {
        const date = new Date(item.dt * 1000);
        const timeStr = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
        const temp = Math.round(item.main.temp);
        const icon = item.weather[0].icon;
        const description = item.weather[0].description;

        const block = document.createElement("div");
        block.style.marginTop = "0.5rem";
        block.style.display = "flex";
        block.style.alignItems = "center";
        block.style.justifyContent = "space-between";

        block.innerHTML = `
          <div style="min-width: 65px; font-size: 0.9rem;">${timeStr}</div>
          <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${description}" width="32" height="32" />
          <div style="flex-grow: 1; font-size: 0.9rem; padding-left: 0.5rem; text-transform: capitalize;">${description}</div>
          <div style="min-width: 35px; font-weight: bold;">${temp}°F</div>
        `;
        dayDiv.appendChild(block);
      });

      forecastContainer.appendChild(dayDiv);
    });
  } catch (err) {
    console.error("Error loading forecast:", err);
    document.getElementById("forecast").textContent = "Failed to load forecast data.";
  }
}

// Run initial fetch and start intervals
fetchCurrentData();
fetchForecas
