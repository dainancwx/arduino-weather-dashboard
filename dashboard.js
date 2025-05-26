function degreesToCompass(deg) {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return directions[Math.round(deg / 45) % 8];
}

fetch('datalog.csv')
  .then(response => response.text())
  .then(data => {
    const rows = data.trim().split('\n');
    const latest = rows[1]?.split(',');

    if (!latest || latest.length < 6) return;

    const [timestamp, temp, humidity, pressure, windSpeed, windDir] = latest;

    document.getElementById('temperature').innerHTML =
      isNaN(temp) ? '-- °F' : `${parseFloat(temp).toFixed(1)}°F`;

    document.getElementById('humidity').textContent =
      isNaN(humidity) ? 'Humidity: --%' : `Humidity: ${parseFloat(humidity).toFixed(1)}%`;

    document.getElementById('pressure').textContent =
      isNaN(pressure) ? 'Pressure: -- hPa' : `Pressure: ${parseFloat(pressure).toFixed(1)} hPa`;

    document.getElementById('windSpeed').textContent =
      isNaN(windSpeed) ? '--' : `${parseFloat(windSpeed).toFixed(1)}`;

    document.getElementById('windDirection').textContent =
      isNaN(windDir) ? '--' : `${parseFloat(windDir)}° (${degreesToCompass(windDir)})`;

    document.getElementById('lastUpdated').textContent = timestamp || '--';
  })
  .catch(error => {
    console.error('Failed to load CSV:', error);
  });
