async function fetchLatestData() {
  try {
    const response = await fetch("data/datalog.csv");
    const text = await response.text();
    const rows = text.trim().split("\n");
    if (rows.length < 2) throw new Error("No data");

    const latest = rows[rows.length - 1].split(",");

    const [timestamp, windSpeed, windDir, humidity, pressure, tempC] = latest;

    const tempF = parseFloat(tempC) * 9/5 + 32;
    const windMph = parseFloat(windSpeed) * 2.237;

    document.getElementById("tempVal").textContent = tempF.toFixed(1);
    document.getElementById("humidityVal").textContent = parseFloat(humidity).toFixed(1);
    document.getElementById("pressureVal").textContent = parseFloat(pressure).toFixed(1);
    document.getElementById("windSpeedVal").textContent = windMph.toFixed(1);
    document.getElementById("windDirVal").textContent = parseFloat(windDir).toFixed(1);
    document.getElementById("lastUpdate").textContent = timestamp;
  } catch (err) {
    console.error("Data fetch error:", err);
  }
}

fetchLatestData();
setInterval(fetchLatestData, 10000);
