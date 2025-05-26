async function fetchLatestData() {
  try {
    const response = await fetch("datalog.csv");
    const text = await response.text();

    // Clean and parse rows
    const rows = text.trim().split("\n").filter(row => row.length > 0);
    if (rows.length < 2) throw new Error("CSV has no data rows");

    const headers = rows[0].split(",").map(h => h.trim());
    const latestRow = rows[rows.length - 1].split(",").map(val => val.trim());

    if (latestRow.length !== headers.length) {
      throw new Error("Header/data column mismatch");
    }

    const data = {};
    headers.forEach((header, idx) => {
      data[header] = latestRow[idx];
    });

    // Parse values
    const tempF = (parseFloat(data["Temperature"]) * 9 / 5 + 32).toFixed(1);
    const humidity = parseFloat(data["Humidity"]).toFixed(1);
    const pressure = parseFloat(data["Pressure"]).toFixed(1);
    const windSpeed = (parseFloat(data["WindSpeed"]) * 2.237).toFixed(1);
    const windDir = parseFloat(data["WindDirection"]).toFixed(1);
    const timestamp = data["Timestamp"];

    // Update DOM
    document.getElementById("tempVal").textContent = tempF;
    document.getElementById("humidityVal").textContent = humidity;
    document.getElementById("pressureVal").textContent = pressure;
    document.getElementById("windSpeedVal").textContent = windSpeed;
    document.getElementById("windDirVal").textContent = windDir;
    document.getElementById("lastUpdate").textContent = timestamp;

  } catch (err) {
    console.error("Failed to load CSV:", err);
  }
}
