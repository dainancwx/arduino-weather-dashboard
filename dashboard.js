async function fetchLatestData() {
  const response = await fetch("data/datalog.csv");
  const text = await response.text();
  const rows = text.trim().split("\n");
  const latest = rows[rows.length - 1].split(",");

  const [timestamp, windSpeed, windDir, hum, pressure, temp] = latest;

  const windSpeedMph = parseFloat(windSpeed) * 2.237;  // Convert m/s to mph

  document.querySelector("#windSpeedCard span").textContent = windSpeedMph.toFixed(1);
  document.querySelector("#windDirCard span").textContent = parseFloat(windDir).toFixed(1);
  document.querySelector("#humidityCard span").textContent = parseFloat(hum).toFixed(1);
  document.querySelector("#pressureCard span").textContent = parseFloat(pressure).toFixed(1);
  document.querySelector("#tempCard span").textContent = parseFloat(temp).toFixed(1);
}

// Initial call
fetchLatestData();

// Update every 10 seconds
setInterval(fetchLatestData, 10000);
