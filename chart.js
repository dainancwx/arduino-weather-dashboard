// chart.js
async function fetchCSV() {
  const response = await fetch("data/datalog.csv");
  const text = await response.text();
  const rows = text.trim().split("\n").slice(1); // skip header

  const timestamps = [], windSpeed = [], windDir = [], hum = [], pressure = [], temp = [];

  rows.forEach(row => {
    const cols = row.split(",");
    timestamps.push(cols[0]);
    windSpeed.push(parseFloat(cols[1]));
    windDir.push(parseFloat(cols[2]));
    hum.push(parseFloat(cols[3]));
    pressure.push(parseFloat(cols[4]));
    temp.push(parseFloat(cols[5]));
  });

  return { timestamps, windSpeed, windDir, hum, pressure, temp };
}

function createChart(id, label, labels, data, color) {
  new Chart(document.getElementById(id), {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: label,
        data: data,
        borderColor: color,
        backgroundColor: `${color}33`,
        tension: 0.4,
        fill: true,
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      layout: {
        padding: {
          top: 20,
          left: 20,
          right: 20,
          bottom: 20
        }
      },
      scales: {
        x: {
          ticks: {
            maxRotation: 90,
            minRotation: 45
          }
        },
        y: {
          beginAtZero: false,
          ticks: {
            callback: function(value) {
              return value.toFixed(2);
            }
          }
        }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              size: 14
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(tooltipItem) {
              return `${tooltipItem.dataset.label}: ${tooltipItem.raw.toFixed(2)}`;
            }
          }
        }
      }
    }
  });
}

fetchCSV().then(({ timestamps, windSpeed, windDir, hum, pressure, temp }) => {
  createChart('windSpeedChart', 'Wind Speed (m/s)', timestamps, windSpeed, 'blue');
  createChart('windDirChart', 'Wind Direction (°)', timestamps, windDir, 'green');
  createChart('humidityChart', 'Humidity (%)', timestamps, hum, 'teal');
  createChart('pressureChart', 'Pressure (hPa)', timestamps, pressure, 'orange');
  createChart('temperatureChart', 'Temperature (°C)', timestamps, temp, 'red');
});
