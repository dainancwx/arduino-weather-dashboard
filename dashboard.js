async function fetchCurrentData() {
  const response = await fetch("data/datalog.csv");
  const text = await response.text();
  const rows = text.trim().split("\n");
  const latest = rows[rows.length - 1].split(",");

  const [timestamp, windSpeed, windDir, hum, pressure, tempC] = latest;

  const windSpeedMph = parseFloat(windSpeed) * 2.237;
  const tempF = (parseFloat(tempC) * 9) / 5 + 32;

  document.querySelector("#windSpeedCard span").textContent = windSpeedMph.toFixed(1);
  document.querySelector("#windDirCard span").textContent = parseFloat(windDir).toFixed(1);
  document.querySelector("#tempValue").textContent = `${tempF.toFixed(1)}°F`;
  document.querySelector("#pressureValue").textContent = `Pressure: ${parseFloat(pressure).toFixed(1)} hPa`;
  document.querySelector("#humidityValue").textContent = `Humidity: ${parseFloat(hum).toFixed(1)} %`;

  // Date formatter (no comma)
  const now = new Date();
  const cleanTime =
    now.getFullYear() + "-" +
    String(now.getMonth() + 1).padStart(2, "0") + "-" +
    String(now.getDate()).padStart(2, "0") + " " +
    String(now.getHours()).padStart(2, "0") + ":" +
    String(now.getMinutes()).padStart(2, "0") + ":" +
    String(now.getSeconds()).padStart(2, "0");

  document.getElementById("lastUpdated").textContent = `Last Updated: ${cleanTime}`;
}

async function fetchForecast() {
  const url = "https://api.openweathermap.org/data/3.0/onecall?lat=37.981104412392135&lon=-90.05484322171593&units=imperial&exclude=minutely,hourly,alerts&appid=2fe133a6e5b09ccbe9f844e3b7164ee0";
  const response = await fetch(url);
  const data = await response.json();

  const forecastContainer = document.getElementById("forecast");
  forecastContainer.innerHTML = "";

  data.daily.slice(0, 5).forEach((dayData) => {
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
}

function updateLiveTime() {
  const now = new Date();
  const timeStr =
    String(now.getHours()).padStart(2, "0") + ":" +
    String(now.getMinutes()).padStart(2, "0") + ":" +
    String(now.getSeconds()).padStart(2, "0");
  document.getElementById("liveTime").textContent = timeStr;
}

// Initial load
fetchCurrentData();
fetchForecast();
updateLiveTime();

// Set intervals
setInterval(fetchCurrentData, 10000);
setInterval(fetchForecast, 600000); // every 10 minutes
setInterval(updateLiveTime, 1000);   // every second
