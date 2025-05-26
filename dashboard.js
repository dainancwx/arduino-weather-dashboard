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
    document.getElementById('lastUpdated').textContent = `Last Updated: ${timestamp}`;
  } catch (error) {
    console.error('Failed to load weather data:', error);
  }
}

function updateClock() {
  const now = new Date();

  console.log('Hour:', now.getHours());
  console.log('Local time:', now.toLocaleTimeString());

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  const formattedTime = now.toLocaleTimeString('en-GB', { hour12: false });

  document.getElementById('liveClock').textContent = `Current Time: ${formattedDate} ${formattedTime}`;
}

loadWeatherData();
updateClock();

setInterval(loadWeatherData, 5000);
setInterval(updateClock, 1000);
