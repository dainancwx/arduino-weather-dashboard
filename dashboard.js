async function loadWeatherData() {
  try {
    const response = await fetch('datalog.csv', { cache: 'no-store' });
    const text = await response.text();
    const lines = text.trim().split('\n');
    if (lines.length < 2) return;

    const latest = lines[lines.length - 1];
    const [timestamp, tempF, humidity, pressure, windSpeed, windDirection] = latest.split(',');

    document.getElementById('temperature').textContent = `${parseFloat(tempF).toFixed(1)}°F`;
    document.getElementById('humidity').textContent = `Humidity: ${humidity}%`;
    document.getElementById('pressure').textContent = `Pressure: ${pressure} hPa`;
    document.getElementById('windSpeed').textContent = `Wind Speed: ${windSpeed} mph`;
    document.getElementById('windDirection').textContent = `Wind Direction: ${windDirection}°`;

    const formattedTimestamp = formatTimestampWithAmPm(timestamp);
    document.getElementById('lastUpdated').textContent = `Last Updated: ${formattedTimestamp}`;
  } catch (error) {
    console.error('Failed to load weather data:', error);
  }
}

function updateClock() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  let hour = now.getHours();
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');

  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  if (hour === 0) hour = 12;

  const timeString = `${hour}:${minute}:${second} ${ampm}`;
  document.getElementById('liveClock').textContent = `Current Time: ${year}-${month}-${day} ${timeString}`;
}

function formatTimestampWithAmPm(timestamp) {
  const [datePart, timePart] = timestamp.split(' ');
  if (!timePart) return timestamp;

  let [hour, minute, second] = timePart.split(':').map(Number);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  if (hour === 0) hour = 12;

  minute = String(minute).padStart(2, '0');
  second = String(second).padStart(2, '0');

  return `${datePart} ${hour}:${minute}:${second} ${ampm}`;
}

loadWeatherData();
updateClock();

setInterval(loadWeatherData, 5000); // every 5 seconds
setInterval(updateClock, 1000);     // every 1 second
