async function loadWeatherData() {
  try {
    // Prevent browser cache for fresh data
    const response = await fetch('datalog.csv', { cache: "no-store" });
    const text = await response.text();
    const lines = text.trim().split('\n');

    // Skip header line and get last data line
    if (lines.length < 2) return; // no data yet
    const latest = lines[lines.length - 1];

    // CSV columns: Timestamp,Temperature,Humidity,Pressure,WindSpeed,WindDirection
    const [timestamp, tempF, humidity, pressure, windSpeed, windDirection] = latest.split(',');

    document.getElementById('temperature').textContent = `${parseFloat(tempF).toFixed(1)}°F`;
    document.getElementById('humidity').textContent = `Humidity: ${humidity}%`;
    document.getElementById('pressure').textContent = `Pressure: ${pressure} hPa`;
    document.getElementById('windSpeed').textContent = `Wind Speed: ${windSpeed} mph`;
    document.getElementById('windDirection').textContent = `Wind Direction: ${windDirection}°`;
    document.getElementById('lastUpdated').textContent = `Last Updated: ${timestamp}`;
  } catch (error) {
    console.error('Failed to load weather data:', error);
  }
}

function updateClock() {
  const now = new Date();
  const timestamp = now.getFullYear() + '-' +
                    String(now.getMonth() + 1).padStart(2, '0') + '-' +
                    String(now.getDate()).padStart(2, '0') + ' ' +
                    String(now.getHours()).padStart(2, '0') + ':' +
                    String(now.getMinutes()).padStart(2, '0') + ':' +
                    String(now.getSeconds()).padStart(2, '0');
  document.getElementById('liveClock').textContent = `Current Time: ${timestamp}`;
}

// Initial load
loadWeatherData();
updateClock();

// Refresh every 30 seconds and 1 second respectively
setInterval(loadWeatherData, 30000);
setInterval(updateClock, 1000);
