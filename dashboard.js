const API_KEY = "your_api_key_here"; // Replace with your actual key
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
    cons
