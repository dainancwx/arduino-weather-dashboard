async function fetchForecast() {
  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&units=imperial&appid=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    const container = document.getElementById("forecast");
    container.innerHTML = "";

    const daily = {};

    data.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const day = date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
      if (!daily[day]) daily[day] = [];
      daily[day].push(item);
    });

    const selectedDays = Object.keys(daily).slice(0, 5);
    selectedDays.forEach(day => {
      const outer = document.createElement("div");
      outer.className = "forecast-day-group";
      const title = document.createElement("h3");
      title.textContent = day;
      outer.appendChild(title);

      const inner = document.createElement("div");
      inner.className = "forecast-subcontainer";

      daily[day].forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const timeLabel = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

        const card = document.createElement("div");
        card.className = "forecast-slot";
        const icon = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;
        card.innerHTML = `
          <div>${timeLabel}</div>
          <img src="${icon}" alt="" />
          <div>${Math.round(forecast.main.temp)} °F</div>
        `;
        inner.appendChild(card);
      });

      outer.appendChild(inner);
      container.appendChild(outer);
    });
  } catch (err) {
    console.error("Forecast error:", err);
    document.getElementById("forecast").textContent = "Failed to load forecast.";
  }
}
