async function loadWeatherData() {
  const response = await fetch('datalog.csv');
  const text = await response.text();
  const lines = text.trim().split('\n');
  const latest = lines[lines.length - 1];
  const [timestamp, tempF, humidity, pressure, windSpeed, windDirection] = latest.split(',');

  document.getElementById('temperature').textContent = `${parseFloat(tempF).toFixed(1)}°F`;
  document.getElementById('humidity').textContent = `Humidity: ${humidity}%`;
  document.getElementById('pressure').textContent = `Pressure: ${pressure} hPa`;
  document.getElementById('windSpeed').textContent = `Wind Speed: ${windSpeed} mph`;
  document.getElementById('windDirection').textContent = `Wind Direction: ${windDirection}°`;
  document.getElementById('lastUpdated').textContent = `Last Updated: ${timestamp}`;
}

function updateClock() {
  const now = new Date();
  const timeString = now.toLocaleString();
  document.getElementById('liveClock').textContent = `Current Time: ${timeString}`;
}

loadWeatherData();
updateClock();
setInterval(updateClock, 1000);
