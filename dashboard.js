async function fetchLatestData() {
  try {
    const response = await fetch("data/datalog.csv");
    const text = await response.text();
    const rows = text.trim().split("\n");

    if (rows.length < 2) throw new Error("Not enough data");

    const headers = rows[0].split(",").map(h => h.trim());
    const latestRow = rows[rows.length - 1].split(",").map(val => val.trim());

    const data = {};
    headers.forEach((h, i) => {
      data[h] = latestRow[i];
    });

    // Fallback if columns missing
    const tempC = parseFloat(data["Temperature"] || data["Temp"] || 0);
    const tempF = (tempC * 9 / 5) + 32;

    const windSpeedMps = parseFloat(data["WindSpeed"] || data["Wind"] || 0);
    const windMph = windSpeedMps * 2.237;

    document.getElementById("tempVal").textContent = tempF.toFixed(1);
    document.getElementById("humidityVal").textContent = parseFloat(data["Humidity"] || 0).toFixed(1);
    document.getElementById("pressureVal").textContent = parseFloat(data["Pressure"] || 0).toFixed(1);
    document.getElementById("windSpeedVal").textContent = windMph.toFixed(1);
    document.getElementById("windDirVal").textContent = parseFloat(data["WindDirection"] || 0).toFixed(1);
    document.getElementById("lastUpdate").textContent = data["Timestamp"] || "--";

  } catch (err) {
    console.error("Error parsing CSV:", err);
  }
}
