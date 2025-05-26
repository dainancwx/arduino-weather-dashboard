async function loadWeatherData() {
  try {
    const response = await fetch('data/datalog.csv');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const csvText = await response.text();

    // Split rows and remove empty lines
    const rows = csvText.trim().split('\n').filter(Boolean);

    if (rows.length < 2) {
      console.warn('CSV has no data rows');
      return;
    }

    // First line is headers, get last data row
    const headers = rows[0].split(',');
    const latestRow = rows[rows.length - 1].split(',');

    console.log('CSV Headers:', headers);
    console.log('Latest data row:', latestRow);

    // Map headers to values for clarity
    const data = {};
    headers.forEach((h, i) => data[h.trim()] = latestRow[i].trim());

    // Parse values
    const tempC = parseFloat(data.Temperature) || 0;
    const tempF = (tempC * 9 / 5) + 32;
    const pressure = parseFloat(data.Pressure) || 0;
    const humidity = parseFloat(data.Humidity) || 0;
    const windSpeed = parseFloat(data.WindSpeed) || 0;
    const windDirection = parseFloat(data.WindDirection) || 0;
    const timestamp = data.Timestamp || '';

    // Update DOM
    document.getElementById('tempValue').textContent = `${tempF.toFixed(1)} °F`;
    document.getElementById('pressureValue').textContent = `Pressure: ${pressure.toFixed(1)} hPa`;
    document.getElementById('humidityValue').textContent = `Humidity: ${humidity.toFixed(1)} %`;
    document.getElementById('windSpeedValue').textContent = `Wind Speed: ${windSpeed.toFixed(1)} mph`;
    document.getElementById('windDirValue').textContent = `Wind Direction: ${windDirection.toFixed(1)} °`;
    document.getElementById('lastUpdated').textContent = `Last Updated: ${timestamp}`;

  } catch (error) {
    console.error('Error loading CSV:', error);
  }
}

function updateLiveTime() {
  const now = new Date();

  // Format time with AM/PM
  let hours = now.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const timeString = `${hours}:${minutes}:${seconds} ${ampm}`;
  document.getElementById('liveTime').textContent = `Live Time: ${timeString}`;
}

// Initial load
loadWeatherData();
updateLiveTime();

// Refresh weather data every 5 seconds
setInterval(loadWeatherData, 5000);

// Update live clock every second
setInterval(updateLiveTime, 1000);
