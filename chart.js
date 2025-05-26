// chart.js
async function fetchCSV() {
  const response = await fetch("data/datalog.csv");
  const text = await response.text();
  const rows = text.trim().split("\n").slice(1); // skip header
  const timestamps = [], temp = [], hum = [], angle = [], sound = [], coil = [];

  rows.forEach(row => {
    const cols = row.split(",");
    timestamps.push(cols[0]);
    temp.push(parseFloat(cols[1]));
    hum.push(parseFloat(cols[2]));
    angle.push(parseFloat(cols[4]));
    sound.push(parseInt(cols[5]));
    coil.push(parseInt(cols[6]));
  });

  return { timestamps, temp, hum, angle, sound, coil };
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

fetchCSV().then(({ timestamps, temp, hum, angle, sound, coil }) => {
  createChart('temperatureChart', 'Temperature (°C)', timestamps, temp, 'red');
  createChart('humidityChart', 'Humidity (%)', timestamps, hum, 'blue');
  createChart('angleChart', 'Angle (°)', timestamps, angle, 'green');
  createChart('soundChart', 'Sound Level', timestamps, sound, 'orange');
  createChart('coilChart', 'Coil Reading', timestamps, coil, 'purple');
});
