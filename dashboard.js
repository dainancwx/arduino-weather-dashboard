// Fetch and update current weather data from your CSV
async function fetchCurrentData() {
  try {
    const response = await fetch("data/datalog.csv");
    const text = await response.text();
    const rows = text.trim().split("\n");

    // Skip header row, get latest data row
    const latest = rows[rows.length - 1].split(",");

    // Your CSV order: Timestamp,WindSpeed,WindDirection,Humidity,Pressure,TempC
    // Adjust as needed based on your actual CSV columns
    const [timestamp, windSpeedRaw, windDirRaw, humRaw, pressureRaw, tempCRaw] = latest;

    const windSpeedMph = parseFloat(windSpeedRaw) * 2.237; // m/s to mph
    const tempF = (parseFloat(tempCRaw) * 9) / 5 + 32;

    document.querySelector("#windSpeedCard span").textContent = windSpeedMph.toFixed(1);
    document.querySelector("#windDirCard span").textContent = parseFloat(windDirRaw).toFixed(1);
    document.querySelector("#tempValue").textContent = `${tempF.toFixed(1)}°F`;
    document.querySelector("#pressureValue").textContent = `Pressure: ${parseFloat(pressureRaw).toFixed(1)} hPa`;
    document.querySelector("#humidityValue").textContent = `Humidity: ${parseFloat(humRaw).toFixed(1)} %`;

    document.getElementById("lastUpdated").textContent = `Last Updated: ${timestamp}`;
  } catch (err) {
    console.error("Error fetching current weather data:", err);
  }
}

// Fetch 7-day forecast from OpenWeatherMap One Call API
async function fetchForecast() {
  try {
    const url = "https://api.openweathermap.org/data/3.0/onecall?lat=37.981104412392135&lon=-90.05484322171593&units=imperial&exclude=minutely,hourly,alerts&appid=2fe133a6e5b09ccbe9f844e3b7164ee0";
    const response = await fetch(url);
    const data = await response.json();

    if (!data.daily || data.daily.length === 0) {
      document.getElementById("forecast").innerHTML = "<p>No forecast data available</p>";
      return;
    }

    const forecastContainer = document.getElementById("forecast");
    forecastContainer.innerHTML = "";

    data.daily.slice(0, 7).forEach((dayData) => {
      const date = new Date(dayData.dt * 1000);
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

      const icon = dayData.weather[0].icon;
      const description = dayData.weather[0].description;
      const max = Math.round(dayData.temp.max);
      const min = Math.round(dayData.temp.min);

      const card = document.createElement("div");
      card.className = "forecast-day";
      card.innerHTML = `
        <div><strong>${dayName}</strong></div>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" />
        <div>${description}</div>
        <div>🔺 ${max}°F</div>
        <div>🔻 ${min}°F</div>
      `;

      forecastContainer.appendChild(card);
    });
  } catch (err) {
    console.error("Error fetching forecast data:", err);
    document.getElementById("forecast").innerHTML = "<p>Error loading forecast data.</p>";
  }
}

// Update the live clock in the dashboard
function updateLiveTime() {
  const now = new Date();

  // Format with AM/PM
  let hours = now.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 -> 12

  const timeStr =
    hours.toString().padStart(2, "0") + ":" +
    now.getMinutes().toString().padStart(2, "0") + ":" +
    now.getSeconds().toString().padStart(2, "0") + " " + ampm;

  document.getElementById("liveTime").textContent = timeStr;
}

// Initial calls
fetchCurrentData();
fetchForecast();
updateLiveTime();

// Intervals: Current data every 5 seconds, forecast every 10 mins, clock every second
setInterval(fetchCurrentData, 5000);
setInterval(fetchForecast, 600000);
setInterval(updateLiveTime, 1000);
