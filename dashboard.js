const API_KEY = "f9c86aa8266a0d5c15d39ad5ca0b6c7e";
const LAT = 38.336418776106676;
const LON = -90.15364904539364;

async function fetchCurrentData() {
  try {
    const response = await fetch("datalog.csv");
    const text = await response.text();
    const rows = text.trim().split("\n");
    const latest = rows[rows.length - 1].split(",");

    const [_, windSpeed, windDir, hum, pressure, tempF] = latest;

    document.getElementById("windSpeedValue").textContent = `${parseFloat(windSpeed).toFixed(1)} mph`;
    document.getElementById("windDirValue").textContent = `${parseFloat(windDir).toFixed(1)} °`;
    document.getElementById("tempValue").textContent = `${parseFloat(tempF).toFixed(1)} °F`;
    document.getElementById("pressureValue").textContent = `Pressure: ${parseFloat(pressure).toFixed(1)} hPa`;
    document.getElementById("humidityValue").textContent = `Humidity: ${parseFloat(hum).toFixed(1)} %`;

    const now = new Date();
    const ampm = now.getHours() >= 12 ? "PM" : "AM";
    const hours = now.getHours() % 12 || 12;
    const time = `${hours.toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")} ${ampm}`;
    const date = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;
    document.getElementById("lastUpdated").textContent = `Last Updated: ${date} ${time}`;
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

function updateLiveTime() {
  const now = new Date();
  const localHours = now.getHours() % 12 || 12;
  const ampm = now.getHours() >= 12 ? "PM" : "AM";

  const local = `${localHours.toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")} ${ampm}`;
  const utc = `${now.getUTCHours().toString().padStart(2, "0")}:${now.getUTCMinutes().toString().padStart(2, "0")}:${now.getUTCSeconds().toString().padStart(2, "0")} UTC`;

  document.getElementById("localTime").textContent = local;
  document.getElementById("utcTime").textContent = utc;
}

async function fetchForecast() {
  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&units=imperial&appid=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    const container = document.getElementById("forecast");
    container.innerHTML = "";

    const selectedForecasts = data.list.filter((_, index) => index % 3 === 0).slice(0, 15); // 5 days × 3 = 15 entries

    selectedForecasts.forEach(item => {
      const time = new Date(item.dt * 1000);
      const displayTime = time.toLocaleString(undefined, {
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });

      const icon = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
      const temp = Math.round(item.main.temp);
      const desc = item.weather[0].description;

      const card = document.createElement("div");
      card.className = "forecast-day";
      card.innerHTML = `
        <div>${displayTime}</div>
        <img src="${icon}" alt="${desc}" title="${desc}" />
        <div>${temp} °F</div>
        <div style="font-size: 0.9rem;">${desc}</div>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error("Forecast error:", err);
    document.getElementById("forecast").textContent = "Failed to load forecast.";
  }
}

async function updateDashboard() {
  await fetchCurrentData();
  updateLiveTime();
  await fetchForecast();
}

updateDashboard();
setInterval(fetchCurrentData, 5000);
setInterval(updateLiveTime, 1000);
setInterval(fetchForecast, 10000);
