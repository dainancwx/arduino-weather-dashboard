async function loadWeatherData() {
  try {
    const response = await fetch('datalog.csv', { cache: 'no-store' });
    const text = await response.text();
    const lines = text.trim().split('\n');

    if (lines.length < 2) return; // No data yet

    const latest = lines[lines.length - 1];
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

  // Format date as YYYY-MM-DD
  const datePart = now.toLocaleDateString('en-CA'); // 'en-CA' formats as YYYY-MM-DD

  // Format time as HH:MM:SS 24-hour format, local time
  const timePart = now.toLocaleTimeString('en-GB', { hour12: false });

  document.getElementById('liveClock').textContent = `Current Time: ${datePart} ${timePart}`;
}

// Initial calls
loadWeatherData();
updateClock();

// Refresh intervals
setInterval(loadWeatherData, 5000); // every 30 seconds
setInterval(updateClock, 1000);       // every 1 second
