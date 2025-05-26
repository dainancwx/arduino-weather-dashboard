// Helper: format Date to 12-hour with AM/PM
function formatTime12(date) {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // convert 0 to 12
  return `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')} ${ampm}`;
}

// Fetch and display current weather data from CSV
async function fetchCurrentData() {
  try {
    const response = await fetch("data/datalog.csv");
    const text = await response.text();
    const rows = text.trim().split("\n");

    // Skip header
    const latest = rows[rows.length - 1].split(",");

    // Make sure your CSV order matches this or adjust:
    // [Timestamp, WindSpeed_mps, WindDirection_deg, Humidity%, Pressure_hPa, Temp_C]
    const [timestamp, windSpeedMps, windDirDeg, hum, pressure, tempC] = latest;

    const windSpeedMph = parseFloat(windSpeedMps) * 2.237;
    const tempF = (parseFloat(tempC) * 9) / 5 + 32;

    document.querySelector("#windSpeedCard span").textContent = windSpeedMph.toFixed(1);
    document.querySelector("#windDirCard span").textContent = Math.round(parseFloat(windDirDeg));
    document.querySelector("#tempValue").textContent = `${tempF.toFixed(1)}°F`;
    document.querySelector("#pressureValue").textContent = `Pressure: ${parseFloat(pressure).toFixed(1)} hPa`;
    document.querySelector("#humidityValue").textContent = `Humidity: ${parseFloat(hum).toFixed(1)} %`;

    // Format Last Updated time with your local time & AM/PM
    const now = new Date();
    const lastUpdatedStr = now.getFullYear() + "-" +
      String(now.getMonth() + 1).padStart(2, "0") + "-" +
      String(now.getDate()).padStart(2, "0") + " " +
      formatTime12(now);

    document.getElementById("lastUpdated").textContent = `Last Updated: ${lastUpdatedStr}`;
  } catch (e) {
    console.error("Failed to fetch current data", e);
  }
}

// Fetch and display 5-day forecast from OpenWeatherMap
async function fetchForecast() {
  try {
    const url = "https://api.openweathermap.org/data/3.0/onecall?lat=37.9811&lon=-90.0548&units=imperial&exclude=minutely,hourly,alerts&appid=2fe133a6e5b09ccbe9f844e3b7164ee0";
    const response = await fetch(url);
    const data = await response.json();

    const forecastContainer = document.getElementById("forecast");
    forecastContainer.innerHTML = "";

    data.daily.slice(0, 5).forEach(dayData => {
      const date = new Date(dayData.dt * 1000);
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

      const icon = dayData.weather[0].icon;
      const description = dayData.weather[0].description;
      const max = Math.round(dayData.temp.max);
      const min = Math.round(dayData.temp.min);

      const card = document.createElement("div");
      card.className = "forecast-day";
      card.innerHTML = `
        <strong>${dayName}</strong>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" />
        <div style="text-transform: capitalize;">${description}</div>
        <div>🔺 ${max}°F</div>
        <div>🔻 ${min}°F</div>
      `;

      forecastContainer.appendChild(card);
    });
  } catch (e) {
    console.error("Failed to fetch forecast", e);
  }
}

// Update live clock every second in 12-hour format with AM/PM
function updateLiveTime() {
  const now = new Date();
  document.getElementById("liveTime").textContent = formatTime12(now);
}

// Initial load
fetchCurrentData();
fetchForecast();
updateLiveTime();

// Set intervals
setInterval(fetchCurrentData, 5000);  // every 5 seconds
setInterval(fetchForecast, 600000);   // every 10 minutes
setInterval(updateLiveTime, 1000);    // every second
