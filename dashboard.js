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

    document.querySelector("#windSpeedValue").textContent = `${(parseFloat(windSpeed) * 2.237).toFixed(1)} mph`;
    document.querySelector("#windDirValue").textContent = `${parseFloat(windDir).toFixed(1)} °`;
    document.querySelector("#tempValue").textContent = `${parseFloat(tempF).toFixed(1)}°F`;
    document.querySelector("#pressureValue").textContent = `Pressure: ${parseFloat(pressure).toFixed(1)} hPa`;
    document.querySelector("#humidityValue").textContent = `Humidity: ${parseFloat(hum).toFixed(1)} %`;

    const now = new Date();
    const cleanTime = now.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });
    document.getElementById("lastUpdated").textContent = `Last Updated: ${cleanTime}`;
  } catch (err) {
    console.error("Error loading current data:", err);
  }
}

async function fetchForecast() {
  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=37.9811&lon=-90.0548&units=imperial&appid=f9c86aa8266a0d5c15d39ad5ca0b6c7e`;
    const response = await fetch(url);
    const data = await response.json();

    const forecastContainer = document.getElementById("forecast");
    forecastContainer.innerHTML = "";

    if (!data.list || data.list.length === 0) {
      forecastContainer.textContent = "No forecast data available";
      return;
    }

    const forecastsByDay = {};
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toISOString().slice(0, 10);
      if (!forecastsByDay[dayKey]) forecastsByDay[dayKey] = [];
      forecastsByDay[dayKey].push(item);
    });

    const days = Object.keys(forecastsByDay).slice(0, 5);

    days.forEach(dayKey => {
      const dayDiv = document.createElement("div");
      dayDiv.className = "forecast-day";

      const dayName = new Date(dayKey).toLocaleDateString("en-US", { weekday: "short" });
      const title = document.createElement("div");
      title.innerHTML = `<strong>${dayName} (${dayKey})</strong>`;
      dayDiv.appendChild(title);

      forecastsByDay[dayKey].forEach(item => {
        const date = new Date(item.dt * 1000);
        const timeStr = date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true
        });
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
    console.error("Error loading forecast data:", err);
    document.getElementById("forecast").textContent = "Failed to load forecast data.";
  }
}

function updateTimeDisplays() {
  const now = new Date();

  // Local Time
  const localTime = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });

  // Zulu Time
  const zuluTime = now.toUTCString().match(/\d{2}:\d{2}:\d{2}/)[0];

  document.getElementById("liveTime").textContent = localTime;
  document.getElementById("zuluTime").textContent = `${zuluTime} UTC`;
}

// Load data
fetchCurrentData();
fetchForecast();
updateTimeDisplays();

// Refresh intervals
setInterval(fetchCurrentData, 5000);
setInterval(fetchForecast, 600000);
setInterval(updateTimeDisplays, 1000);
