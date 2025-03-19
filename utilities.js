import axios from "axios";

function dateAndTime(time) {
    const dateString = time;

    // Tworzymy obiekt Date
    const dateObj = new Date(dateString);
  
    // Opcje do wyświetlenia dnia tygodnia w języku angielskim
    const options = { weekday: 'long' };
    const dayOfWeekEN = dateObj.toLocaleDateString('en-US', options);
  
    // Rozdzielenie daty (rok-miesiąc-dzień) na osobną zmienną
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const dateOnly = `${day}.${month}.${year}`;

    // Rozdzielenie godziny (hh:mm) na osobną zmienną
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    const timeOnly = `${hours}:${minutes}`;
    
    return { date: dateOnly, time: timeOnly, dayOfWeek: dayOfWeekEN }
}

async function searchCity(query) {
    try {
      const response = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
        params: {
          name: query,
          count: 10,
          language: 'en'
        }
      });
      return response.data.results || [];
    } catch (error) {
      console.error("Błąd przy wyszukiwaniu miasta:", error);
      return [];
    }
}

async function getHourlyWeather(latitude, longitude) {
    try {
      const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
        params: {
          latitude,
          longitude,
          hourly: 'temperature_2m,precipitation,weather_code,windspeed_10m,visibility,winddirection_10m,relative_humidity_2m',
          forecast_days: 1,
          timezone: 'auto'
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error while fetching weather data:", error);
      throw error;
    }
}

function getWeatherDescription(code) {
  switch (code) {
    case 0:
      return { description: "Clear sky", icon: "01-clear-sky.png" };
    case 1:
      return { description: "Mainly clear", icon: "02-mainly-clear.png" };
    case 2:
      return { description: "Partly cloudy", icon: "03-partly-cloudy.png" };
    case 3:
      return { description: "Cloudy", icon: "04-cloudy.png" };
    case 45:
      return { description: "Fog", icon: "45-fog.png" };
    case 48:
      return { description: "Depositing rime fog", icon: "48-depositing-rime-fog.png" };
    case 51:
      return { description: "Drizzle: Light intensity", icon: "51-53-55-drizzle.png" };
    case 53:
      return { description: "Drizzle: Moderate intensity", icon: "51-53-55-drizzle.png" };
    case 55:
      return { description: "Drizzle: Dense intensity", icon: "51-53-55-drizzle.png" };
    case 56:
      return { description: "Freezing Drizzle: Light intensity", icon: "56-57-freezing-drizzle.png" };
    case 57:
      return { description: "Freezing Drizzle: Heavy intensity", icon: "56-57-freezing-drizzle.png" };
    case 61:
      return { description: "Rain: Slight intensity", icon: "61-63-rain-80-81.png" };
    case 63:
      return { description: "Rain: Moderate intensity", icon: "61-63-rain-80-81.png" };
    case 65:
      return { description: "Rain: Heavy intensity", icon: "65-heavy-rain-82-85-86.png" };
    case 66:
      return { description: "Freezing Rain: Light intensity", icon: "66-freezing-rain-light.png" };
    case 67:
      return { description: "Freezing Rain: Heavy intensity", icon: "67-freezing-rain-heavy.png" };
    case 71:
      return { description: "Snow fall: Slight intensity", icon: "71-73-snow-fall-ight.png" };
    case 73:
      return { description: "Snow fall: Moderate intensity", icon: "71-73-snow-fall-ight.png" };
    case 75:
      return { description: "Snow fall: Heavy intensity", icon: "75-77-snow-fall-heavy.png" };
    case 77:
      return { description: "Snow grains", icon: "75-77-snow-fall-heavy.png" };
    case 80:
      return { description: "Rain showers: Slight", icon: "61-63-rain-80-81.png" };
    case 81:
      return { description: "Rain showers: Moderate", icon: "61-63-rain-80-81.png" };
    case 82:
      return { description: "Rain showers: Violent", icon: "65-heavy-rain-82-85-86.png" };
    case 85:
      return {description: "Snow showers: Slight", icon: "71-73-snow-fall-ight.png"};
    case 86:
      return { description: "Snow showers: Heavy", icon: "75-77-snow-fall-heavy.png" };
    case 95:
      return { description: "Thunderstorm: moderate", icon: "95-thunderstorm-light.png" };
    case 96:
      return { description: "Thunderstorm with hail: moderate", icon: "96-99-thunderstorm-heavy.png" };
    case 99:
      return { description: "Thunderstorm with hail: Heavy", icon: "96-99-thunderstorm-heavy.png" };
    default:
      return "Unknown code";
  }
}

export { dateAndTime, getHourlyWeather, searchCity, getWeatherDescription };