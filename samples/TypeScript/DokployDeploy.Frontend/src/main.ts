import './style.css'

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string | null;
}

// Aspire injects the API base URL via VITE_ prefixed environment variables
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '';

async function fetchWeather(): Promise<WeatherForecast[]> {
  const response = await fetch(`${apiBaseUrl}/weatherforecast`);
  return response.json();
}

function renderWeather(forecasts: WeatherForecast[]): string {
  const rows = forecasts
    .map(
      (f) =>
        `<tr><td>${f.date}</td><td>${f.temperatureC}</td><td>${f.temperatureF}</td><td>${f.summary ?? ''}</td></tr>`
    )
    .join('');
  return `<table>
    <thead><tr><th>Date</th><th>Temp (°C)</th><th>Temp (°F)</th><th>Summary</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>`;
}

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <h1>Dokploy + Aspire — Vite Frontend</h1>
  <p>This sample fetches weather data from the .NET API service, orchestrated via a TypeScript Aspire AppHost and published to Dokploy.</p>
  <h2>Weather Forecast</h2>
  <div id="weather">Loading...</div>
`;

fetchWeather()
  .then((data) => {
    document.querySelector<HTMLDivElement>('#weather')!.innerHTML = renderWeather(data);
  })
  .catch((err: unknown) => {
    document.querySelector<HTMLDivElement>('#weather')!.textContent =
      `Error fetching weather: ${err instanceof Error ? err.message : String(err)}`;
  });

