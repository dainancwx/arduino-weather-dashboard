const API_KEY = "f9c86aa8266a0d5c15d39ad5ca0b6c7e"; // Your API key
const LAT = 37.9811;
const LON = -90.0548;

async function fetchCurrentData() {
  try {
    const response = await fetch("datalog.csv");
    const text = await response.text();
    const rows = text.trim().split("\n");
    const latest = rows[rows.length - 1].split(",");

    // Columns in CSV: timestamp, windSpeed, windDir, hum, pressure, tempF
    const [timestamp, windSpeed, windDir, hum, pressure, tempF] = latest;

    document.querySelector("#windSpeedValue").textContent = `${parseFloat(windSpeed).toFixed(1)} mph`;
    document.querySelector("#windDirValue").textContent = `${parseFloat(windDir).toFixed(1)} °`;
    document.querySelector("#tempValue").textContent = `${parseFloat(tempF).toFixed(1)} °F`;
    document.querySelector("#pressureValue").textContent = `Pressure: ${parseFloat(pressure).toFixed(1)} hPa`;
    document.querySelector("#humidityValue").textContent = `Humidity: ${parseFloat(hum).toFixed(1)} %`;

    // Update last updated time in local with AM/PM format
    const now = new Date();
    let hours = now.getHours();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
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

async function fetchForecast() {
  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&units=imperial&appid=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.list) {
      document.getElementById("forecast").textContent = "No forecast data available.";
      return;
    }

    // We'll display one forecast per day at roughly 12:00 PM local time
    // Group by date (YYYY-MM-DD)
    const forecastsByDate = {};
    data.list.forEach(entry => {
      const dateTime = new Date(entry.dt * 1000);
      const dateStr = dateTime.toISOString().split("T")[0];
      const hour = dateTime.getHours();
      // Pick forecasts at or near 12:00 (between 11-13)
      if (!forecastsByDate[dateStr]) forecastsByDate[dateStr] = [];
      forecastsByDate[dateStr].push({ entry, hour });
    });

    // Extract one forecast per day around noon
    const dailyForecasts = [];
    for (const date in forecastsByDate) {
      const dayEntries = forecastsByDate[date];
      // Find the forecast closest to 12:00
      dayEntries.sort((a, b) => Math.abs(a.hour - 12) - Math.abs(b.hour - 12));
      dailyForecasts.push(dayEntries[0].entry);
    }

    // Limit to 5 days max
    const forecastContainer = document.getElementById("forecast");
    forecastContainer.innerHTML = "";
    dailyForecasts.slice(0, 5).forEach(forecast => {
      const dateTime = new Date(forecast.dt * 1000);
      const options = { weekday: "short", month: "short", day: "numeric" };
      const dayStr = dateTime.toLocaleDateString(undefined, options);

      const temp = Math.round(forecast.main.temp);
      const iconCode = forecast.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
      const description = forecast.weather[0].description;

      const card = document.createElement("div");
      card.className = "forecast-day";
      card.innerHTML = `
        <div>${dayStr}</div>
        <img src="${iconUrl}" alt="${description}" title="${description}" />
        <div>${temp} °F</div>
      `;
      forecastContainer.appendChild(card);
    });
  } catch (err) {
    console.error("Error fetching forecast:", err);
    document.getElementById("forecast").textContent = "Loading forecast..";
  }
}

function updateLiveTime() {
  const now = new Date();

  // Local time with AM/PM
  let hours = now.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const localTimeStr =
    hours.toString().padStart(2, "0") + ":" +
    now.getMinutes().toString().padStart(2, "0") + ":" +
    now.getSeconds().toString().padStart(2, "0") + " " + ampm;

  // UTC time, no AM/PM but with "UTC" suffix
  const utcHours = now.getUTCHours().toString().padStart(2, "0");
  const utcMinutes = now.getUTCMinutes().toString().padStart(2, "0");
  const utcSeconds = now.getUTCSeconds().toString().padStart(2, "0");
  const utcTimeStr = `${utcHours}:${utcMinutes}:${utcSeconds} UTC`;

  document.getElementById("localTime").textContent = localTimeStr;
  document.getElementById("utcTime").textContent = utcTimeStr;
}

async function updateDashboard() {
  await fetchCurrentData();
  await fetchForecast();
  updateLiveTime();
}

// Update every 10 seconds
updateDashboard();
setInterval(() => {
  fetchCurrentData();
  updateLiveTime();
}, 10000);

// Update forecast every 10 minutes (600000 ms)
setInterval(fetchForecast, 600000);
