// Helper: Convert wind direction degrees to compass
function degreesToCompass(deg) {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return directions[Math.round(deg / 45) % 8];
}

// Load CSV and update dashboard
fetch('datalog.csv')
  .then(response => response.text())
  .then(data => {
    const rows = data.trim().split('\n');
    const headers = rows[0].split(',');
    const latest = rows[1]?.split(',');

    if (!latest || latest.length < 6) {
      console.warn('No valid data in CSV.');
      return;
    }

    // Parse values
    const [
      timestamp,
      temp,
      humidity,
      pressure,
      windSpeed,
      windDirection
    ] = latest;

    // Update DOM
    document.getElementById('temperature').innerHTML = 
      isNaN(temp) ? '-- °F' : `${parseFloat(temp).toFixed(1)}°F`;
    document.getElementById('humidity').textContent = 
      isNaN(humidity) ? '--%' : `${parseFloat(humidity).toFixed(1)}%`;
    document.getElementById('pressure').textContent = 
      isNaN(pressure) ? '-- hPa' : `${parseFloat(pressure).toFixed(1)} hPa`;
    document.getElementById('windSpeed').textContent = 
      isNaN(windSpeed) ? '--' : `${parseFloat(windSpeed).toFixed(1)}`;
    document.getElementById('windDirection').textContent = 
      isNaN(windDirection) ? '--' : `${parseFloat(windDirection)}° (${degreesToCompass(windDirection)})`;
    document.getElementById('lastUpdated').textContent = 
      timestamp || '--';
  })
  .catch(error => {
    console.error('Error loading CSV:', error);
  });
