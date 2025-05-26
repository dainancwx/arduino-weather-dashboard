async function fetchLatestData() {
  try {
    const response = await fetch("data/datalog.csv");
    const text = await response.text();
    const rows = text.trim().split("\n");

    if (rows.length < 2) throw new Error("CSV has no data rows");

    const latest = rows[rows.length - 1].split(",");

    const [timestamp, windSpeed, windDir, hum, pressure, tempC] = latest;

    const tempF = parseFloat(tempC) * 9 / 5 + 32;
    const windSpeedMph = parseFloat(windSpeed) * 2.237;

    // Update DOM
    document.querySelector("#tempCard span").textContent = tempF.toFixed(1);
    document.querySelector("#humidityVal").textContent = parseFloat(hum).toFixed(1);
    document.querySelector("#pressureVal").textContent = parseFloat(pressure).toFixed(1);
    document.querySelector("#windSpeedVal").textContent = windSpeedMph.toFixed(1);
    document.querySelector("#windDirVal").textContent = parseFloat(windDir).toFixed(1);
    document.querySelector("#lastUpdate").textContent = timestamp;
  } catch (err) {
    console.error("Data fetch error:", err);
  }
}

// Initial load + repeat
fetchLatestData();
setInterval(fetchLatestData, 10000);
