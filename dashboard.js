async function fetchLatestData() {
  try {
    const response = await fetch("data/datalog.csv");
    const text = await response.text();
    const rows = text.trim().split("\n");

    if (rows.length < 2) {
      console.error("No data available");
      return;
    }

    const latest = rows[rows.length - 1].split(",");
    const [timestamp, windSpeed, windDir, hum, pressure, tempC] = latest;

    // Convert temperature from Celsius to Fahrenheit
    const tempF = parseFloat(tempC) * 9 / 5 + 32;

    // Convert wind speed to mph
    const windSpeedMph = parseFloat(windSpeed) * 2.237;

    // Update DOM elements
    document.querySelector("#windSpeedCard span").textContent = windSpeedMph.toFixed(1);
    document.querySelector("#humidityCard span").textContent = parseFloat(hum).toFixed(1);
    document.querySelector("#pressureCard span").textContent = parseFloat(pressure).toFixed(1);
    document.querySelector("#tempCard span").textContent = tempF.toFixed(1);

    const windDeg = parseFloat(windDir);
    document.querySelector("#windDirValue").textContent = windDeg.toFixed(1);
    document.querySelector("#windArrow").style.transform = `rotate(${windDeg}deg)`;

    // Update last updated time
    document.querySelector("#lastUpdate").textContent = `Last updated: ${timestamp}`;
  } catch (error) {
    console.error("Failed to fetch or parse weather data:", error);
  }
}

// Initial load
fetchLat
