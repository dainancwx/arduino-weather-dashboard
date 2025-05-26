const API_KEY = "f9c86aa8266a0d5c15d39ad5ca0b6c7e"; // replace with your key
const LAT = 37.9811;
const LON = -90.0548;

// Fetch current data from CSV and update dashboard
async function fetchCurrentData() {
  try {
    const response = await fetch("data/datalog.csv");
    const text = await response.text();
    const rows = text.trim().split("\n");
    const latest = rows[rows.length - 1].split(",");

    // Assuming CSV columns: timestamp, windSpeed, windDir, hum, pressure, tempC
    const [timestamp, windSpeed, windDir, hum, pressure, tempC] = latest;

    // Convert units
    const windSpeedMph = parseFloat(windSpeed) * 2.237;
    const tempF = (parseFloat(tempC) * 9) / 5 + 32;

    // Update DOM
    document.getElementById("windSpeedValue").textContent = windSpeedMph.toFixed(1);
    document.getElementById("windDirValue").textContent = parseFloat(windDir).toFixed(1);
    document.getElementById("tempValue").textContent = `${tempF.toFixed(1)}°F`;
    document.getElementById("pressureValue").textContent = `Pressure: ${parseFloat(pressure).toFixed(1)} hPa`;
    document.getElementById("humidityValue").textContent = `Humidity: ${parseFloat(hum).toFixed(1)} %`;

    // Update last updated timestamp (current time with AM/PM)
    const now = new Date();
    let hours = now.getHours();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert to 12-hour format
    const cleanTime =
      now.getFullYear() + "-" +
      String(now.getMonth() + 1).padStart(2, "0") + "-" +
      String(now.getDate()).padStart(2, "0") + " " +
      hours.toString().padStart(2, "0") + ":" +
      String(now.getMinutes()).padStart(2, "0") + ":" +
      String(now.getSeconds()).padStart(2, "0") + " " + ampm;

    document.getElementById("lastUpdated").textContent = `Last Updated: ${cleanTime}`;
  } catch (err) {
    console.error("Error loading current data:", err);
  }
}

// Fetch 5-day 3-hour forecast from OpenWeather API and update dashboard
async function fetchForecast() {
  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&units=imperial&appid=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    const forecastContainer = document.getElementById("forecast");
    forecastContainer.innerHTML = "";

    if (!data.list || data.list.length === 0) {
      forecastContainer.textContent = "No forecast data available";
      return;
    }

    // Group forecasts by date (YYYY-MM-DD)
    const forecastsByDay = {};
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toISOString().slice(0, 10);
      if (!forecastsByDay[dayKey]) forecastsByDay[dayKey] = [];
      forecastsByDay[dayKey].push(item);
    });

    // Show first 5 days only
    const days = Object.keys(forecastsByDay).slice(0, 5);

    days.forEach(dayKey => {
      const dayForecasts = forecastsByDay[dayKey];
      const dayName = new Date(dayKey).toLocaleDateString("en-US", { weekday: "short" });

      const dayDiv = document.createElement("div");
      dayDiv.className = "forecast-day";

      // Day header
      const dayTitle = document.createElement("div");
      dayTitle.innerHTML = `<strong>${dayName} (${dayKey})</strong>`;
      dayDiv.appendChild(dayTitle);

      // Add 3-hour forecast blocks
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
    console.error("Error loading forecast data:", err);
    document.getElementById("forecast").textContent = "Failed to load forecast data.";
  }
}

// Update live clock time every second
function updateLiveTime() {
  const now = new Date();
  let hours = now.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const timeStr =
    hours.toString().padStart(2, "0") + ":" +
    String(now.getMinutes()).padStart(2, "0") + ":" +
    String(now.getSeconds()).padStart(2, "0") + " " + ampm;
  document.getElementById("liveTime").textContent = timeStr;
}

// Initial data load and repeated updates
fetchCurrentData();
fetchForecast();
updateLiveTime();

setInterval(fetchCurrentData, 5000);   // update CSV data every 5 sec
setInterval(fetchForecast, 600000);    // update forecast every 10 min
setInterval(updateLiveTime, 1000);     // update live time every second
