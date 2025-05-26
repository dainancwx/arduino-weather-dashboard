function degreesToCompass(deg) {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return directions[Math.round(deg / 45) % 8];
}

fetch('datalog.csv')
  .then(response => response.text())
  .then(data => {
    const lines = data.trim().split('\n');
    const lastLine = lines[lines.length - 1];
    const [timestamp, temperature, humidity, pressure, windSpeed, windDirection] = lastLine.split(',');

    document.getElementById('temperature').innerText = `${temperature}°F`;
    document.getElementById('humidity').innerText = `Humidity: ${humidity}%`;
    document.getElementById('pressure').innerText = `Pressure: ${pressure} hPa`;
    document.getElementById('windSpeed').innerText = `${windSpeed} mph`;
    document.getElementById('windDirection').innerText = `${windDirection}°`;
    document.getElementById('lastUpdated').innerText = timestamp;
  })
  .catch(err => {
    console.error('Error loading data:', err);
  });
