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

    // Format last updated time with AM/PM
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

  let hours = now.getHours() % 12;
  hours = hours === 0 ? 12 : hours;  // Convert 0 to 12 for 12-hour clock
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const ampm = now.getHours() >= 12 ? 'PM' : 'AM';

  const timeString = `${hours}:${minutes}:${seconds} ${ampm}`;

  document.getElementById('liveClock').textContent = `Current Time: ${year}-${month}-${day} ${timeString}`;
}

loadWeatherData();
updateClock();

setInterval(loadWeatherData, 5000);
setInterval(updateClock, 1000);
