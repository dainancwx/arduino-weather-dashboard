const API_KEY = "f9c86aa8266a0d5c15d39ad5ca0b6c7e";
const LAT = 37.9811;
const LON = -90.0548;

async function fetchCurrentData() {
  try {
    const response = await fetch("datalog.csv");
    const text = await response.text();
    const rows = text.trim().split("\n");
    const latest = rows[rows.length - 1].split(",");

    // CSV columns: timestamp, windSpeed, windDir, hum, pressure, tempF
    const [timestamp, windSpeed, windDir, hum, pressure, tempF] = latest;

    document.getElementById("windSpeedValue").textContent = `${parseFloat(windSpeed).toFixed(1)} mph`;
    document.getElementById("windDirValue").textContent = `${parseFloat(windDir).toFixed(1)} °`;
    document.getElementById("tempValue").textContent = `${parseFloat(tempF).toFixed(1)} °F`;
    document.getElementById("pressureValue").textContent = `Pressure: ${parseFloat(pressure).toFixed(1)} hPa`;
    document.getElementById("humidityValue").textContent = `Humidity: ${parseFloat(hum).toFixed(1)} %`;

    // Update last updated to local time with AM/PM
    const now = new Date();
    let hours = now.getHours();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const formattedTime = `${hours.toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")} ${ampm}`;
    const dateString = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,"0")}-${now.getDate().toString().padStart(2,"0")}`;

    document.getElementById("lastUpdated").textContent = `Last Updated: ${dateString} ${formattedTime}`;
  } catch (error) {
    console.error("Error loading current data:", error);
  }
}

async function fetchForecast() {
  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=37.9811&lon=-90.0548&units=imperial&appid=f9c86aa8266a0d5c15d39ad5ca0b6c7e`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.list) {
      document.getElementById("forecast").textContent = "No forecast data available.";
      return;
    }

    // Group by date to find forecast closest to 12:00
    const dailyForecasts = {};
    data.list.forEach(forecast => {
      const dt = new Date(forecast.dt * 1000);
      const dateStr = dt.toISOString().split("T")[0];
      if (!dailyForecasts[dateStr]) dailyForecasts[dateStr] = [];
      dailyForecasts[dateStr].push(forecast);
    });

    const forecastContainer = document.getElementById("forecast");
    forecastContainer.innerHTML = "";

    // Pick one forecast per day near 12:00 PM
    Object.keys(dailyForecasts).slice(0,5).forEach(date => {
      const dayForecasts = dailyForecasts[date];
      dayForecasts.sort((a,b) => Math.abs(new Date(a.dt*1000).getHours() - 12) - Math.abs(new Date(b.dt*1000).getHours() - 12));
      const forecast = dayForecasts[0];

      const dateObj = new Date(forecast.dt * 1000);
      const options = { weekday: "short", month: "short", day: "numeric" };
      const dayStr = dateObj.toLocaleDateString(undefined, options);

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
  } catch (error) {
    console.error("Error fetching forecast:", error);
    document.getElementById("forecast").textContent = "Loading forecast..";
  }
}

function updateLiveTime() {
  const now = new Date();

  // Local time with AM/PM
  let hours = now.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const localTimeStr = `${hours.toString().padStart(2,"0")}:${now.getMinutes().toString().padStart(2,"0")}:${now.getSeconds().toString().padStart(2,"0")} ${ampm}`;

  // UTC time with "UTC" suffix
  const utcHours = now.getUTCHours().toString().padStart(2,"0");
  const utcMinutes = now.getUTCMinutes().toString().padStart(2,"0");
  const utcSeconds = now.getUTCSeconds().toString().padStart(2,"0");
  const utcTimeStr = `${utcHours}:${utcMinutes}:${utcSeconds} UTC`;

  document.getElementById("localTime").textContent = localTimeStr;
  document.getElementById("utcTime").textContent = utcTimeStr;
}

async function updateDashboard() {
  await fetchCurrentData();
  await fetchForecast();
  updateLiveTime();
}

// Initial load
updateDashboard();

// Update current data and live time every 10 seconds
setInterval(() => {
  fetchCurrentData();
  updateLiveTime();
}, 10000);

// Update forecast every 10 minutes
setInterval(fetchForecast, 600000);
