function updateDashboard(data) {
  document.getElementById('temperature').textContent = `${data.temperature || '--'}°F`;
  document.getElementById('humidity').textContent = `${data.humidity || '--'}%`;
  document.getElementById('pressure').textContent = `${data.pressure || '--'} hPa`;
  document.getElementById('windSpeed').textContent = data.windSpeed || '--';
  document.getElementById('windDirection').textContent = `${data.windDirection || '--'}°`;
  document.getElementById('lastUpdated').textContent = data.timestamp || '--';
}

function fetchData() {
  fetch('datalog.csv')
    .then((response) => response.text())
    .then((csvText) => {
      const lines = csvText.trim().split('\n');
      const latest = lines[lines.length - 1].split(',');
      const [timestamp, temperature, humidity, pressure, windSpeed, windDirection] = latest;
      updateDashboard({ timestamp, temperature, humidity, pressure, windSpeed, windDirection });
    })
    .catch((error) => console.error('Error fetching data:', error));
}

function updateTime() {
  const now = new Date();
  const formatted = now.toLocaleString();
  document.getElementById('datetime').textContent = formatted;
}

setInterval(updateTime, 1000);
setInterval(fetchData, 5000);

updateTime();
fetchData();
