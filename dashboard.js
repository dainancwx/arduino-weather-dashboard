// Load latest sensor data from local CSV
async function loadSensorData() {
  try {
    const response = await fetch('datalog.csv');
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const csvText = await response.text();
    const rows = csvText.trim().split('\n').filter(Boolean);
    if (rows.length < 2) {
      console.warn('CSV has no data rows');
      return;
    }

    const headers = rows[0].split(',');
    const latestRow = rows[rows.length - 1].split(',');

    // Map headers to values
    const data = {};
    headers.forEach((h, i) => data[h.trim()] = latestRow[i].trim());

    // Parse sensor values
    const tempC = parseFloat(data.Temperature) || 0;
    const tempF = (tempC * 9 / 5) + 32;
    const pressure = parseFloat(data.Pressure) || 0;
    const humidity = parseFloat(data.Humidity) || 0;
    const windSpeed = parseFloat(data.WindSpeed) || 0;
    const windDirection = parseFloat(data.WindDirection) || 0;
    const timestamp = data.Timestamp || '';

    // Update DOM for sensor data
    document.getElementById('tempValue').textContent = `${tempF.toFixed(1)} °F`;
    document.getElementById('pressureValue').textContent = `Pressure: ${pressure.toFixed(1)} hPa`;
    document.getElementById('humidityValue').textContent = `Humidity: ${humidity.toFixed(1)} %`;
    document.getElementById('windSpeedValue').textContent = `${windSpeed.toFixed(1)} mph`;
    document.getElementById('windDirValue').textContent = `${windDirection.toFixed(1)} °`;
    document.getElementById('lastUpdated').textContent = `Last Updated: ${timestamp}`;

  } catch (error) {
    console.error('Error loading CSV:', error);
  }
}

// Fetch 7-day forecast from OpenWeather API
async function loadForecast() {
  try {
    const apiKey = 'e206db49c3fd97a44f2e622d697c0bd7';  // replace with your actual API key
    const lat = 37.981104412392135;
    const lon = -90.05484322171593;
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly,alerts&appid=${e206db49c3fd97a44f2e622d697c0bd7}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`API error! Status: ${response.status}`);

    const data = await response.json();

    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '';

    data.daily.slice(0, 7).forEach(dayData => {
      const date = new Date(dayData.dt * 1000);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

      const icon = dayData.weather[0].icon;
      const description = dayData.weather[0].description;
      const max = Math.round(dayData.temp.max);
      const min = Math.round(dayData.temp.min);

      const card = document.createElement('div');
      card.className = 'forecast-day';
      card.innerHTML = `
        <div><strong>${dayName}</strong></div>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" />
        <div>${description}</div>
        <div>🔺 ${max}°F</div>
        <div>🔻 ${min}°F</div>
      `;
      forecastContainer.appendChild(card);
    });
  } catch (error) {
    console.error('Error fetching forecast:', error);
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.textContent = 'No forecast data available';
  }
}

// Update live clock with AM/PM
function updateLiveTime() {
  const now = new Date();
  let hours = now.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  document.getElementById('liveTime').textContent = `Live Time: ${hours}:${minutes}:${seconds} ${ampm}`;
}

// Initial load
loadSensorData();
loadForecast();
updateLiveTime();

// Intervals
setInterval(loadSensorData, 5000);  // refresh sensor data every 5 seconds
setInterval(loadForecast, 600000);  // refresh forecast every 10 minutes
setInterval(updateLiveTime, 1000);  // update clock every second
