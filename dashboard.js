async function fetchLatestData() {
  const response = await fetch("data/datalog.csv");
  const text = await response.text();
  const rows = text.trim().split("\n");
  const latest = rows[rows.length - 1].split(",");

  const [timestamp, windSpeed, windDir, hum, pressure, temp] = latest;

  document.querySelector("#windSpeedCard span").textContent = parseFloat(windSpeed).toFixed(1);
  document.querySelector("#windDirCard span").textContent = parseFloat(windDir).toFixed(1);
  document.querySelector("#humidityCard span").textContent = parseFloat(hum).toFixed(1);
  document.querySelector("#pressureCard span").textContent = parseFloat(pressure).toFixed(1);
  document.querySelector("#tempCard span").textContent = parseFloat(temp).toFixed(1);
}

// Call on load
fetchLatestData();

// Optional auto-refresh every 10 seconds
setInterval(fetchLatestData, 10000);
