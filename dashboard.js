const API_KEY = "f9c86aa8266a0d5c15d39ad5ca0b6c7e"; // Replace with your actual key
const LAT = 37.9811;
const LON = -90.0548;

async function fetchCurrentData() {
  try {
    const response = await fetch("data/datalog.csv");
    const text = await response.text();
    const rows = text.trim().split("\n");
    const latest = rows[rows.length - 1].split(",");

    const [timestamp, windSpeed, windDir, hum, pressure, tempC] = latest;
    const windSpeedMph = parseFloat(windSpeed) * 2.237;
    const tempF = (parseFloat(tempC) * 9) / 5 + 32;

    document.getElementById("windSpeedValue").textContent = `${windSpeedMph.toFixed(1)} mph`;
    document.getElementById("windDirValue").textContent = `${parseFloat(windDir).toFixed(1)} °`;
    document.getElementById("tempValue").textContent = `${tempF.toFixed(1)} °F`;
    document.getElementById("pressureValue").textContent = `Pressure: ${parseFloat(pressure).toFixed(1)} hPa`;
    document.getElementById("humidityValue").textContent = `Humidity: ${parseFloat(hum).toFixed(1)} %`;

    const now = new Date();
    const formattedTime = now.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    document.getElementById("lastUpdated").textContent = `Last Updated: ${formattedTime}`;
  } catch (err) {
    console.error("Error loading current data:", err);
  }
}

async function fetchForecast() {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${37.9811}&lon=${-90.0548}&units=imperial&appid=${f9c86aa8266a0d5c15d39ad5ca0b6c7e}`);
    
    const data = await response.json();

    const forecastEl = document.getElementById("forecast");
    forecastEl.innerHTML = "";

    if (!data.list || data.list.length === 0) {
      forecastEl.textContent = "No forecast data available";
      return;
    }

    const forecastsByDay = {};

    data.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toISOString().split("T")[0];

      if (!forecastsByDay[dateKey]) forecastsByDay[dateKey] = [];
      forecastsByDay[dateKey].push(item);
    });

    Object.entries(forecastsByDay).slice(0, 5).forEach(([dateKey, entries]) => {
      const dayDiv = document.createElement("div");
      dayDiv.className = "forecast-day";

      const dateObj = new Date(dateKey);
      const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });

      const title = document.createElement("div");
      title.innerHTML = `<strong>${dayName} (${dateKey})</strong>`;
      dayDiv.appendChild(title);

      entries.forEach(entry => {
        const date = new Date(entry.dt * 1000);
        const time = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
        const temp = Math.round(entry.main.temp);
        const icon = entry.weather[0].icon;
        const desc = entry.weather[0].description;

        const block = document.createElement("div");
        block.style.display = "flex";
        block.style.alignItems = "center";
        block.style.justifyContent = "space-between";
        block.style.marginTop = "0.5rem";

        block.innerHTML = `
          <div style="min-width: 65px; font-size: 0.9rem;">${time}</div>
          <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${desc}" width="32" height="32" />
          <div style="flex-grow: 1; font-size: 0.9rem; padding-left: 0.5rem; text-transform: capitalize;">${desc}</div>
          <div style="min-width: 35px; font-weight: bold;">${temp}°F</div>
        `;

        dayDiv.appendChild(block);
      });

      forecastEl.appendChild(dayDiv);
    });
  } catch (err) {
    console.error("Error fetching forecast:", err);
    document.getElementById("forecast").textContent = "Failed to load forecast data.";
  }
}

function updateLiveTime() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", { hour12: true });
  document.getElementById("liveTime").textContent = timeStr;
}

// Initial load
fetchCurrentData();
fetchForecast();
updateLiveTime();

// Refresh intervals
setInterval(fetchCurrentData, 5000);
setInterval(fetchForecast, 600000);
setInterval(updateLiveTime, 1000);
