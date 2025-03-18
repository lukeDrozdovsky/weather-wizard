import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

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

async function getWeather(latitude, longitude) {
    try {
      const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
        params: {
          latitude,
          longitude,
          hourly: 'temperature_2m,precipitation,weather_code,windspeed_10m,winddirection_10m'
        }
      });
      return response.data;
    } catch (error) {
      console.error("Błąd przy pobieraniu pogody:", error);
      throw error;
    }
  }
  function dateAndTime(time) {
    const dateString = time;
        //console.log(dateString);
        // Tworzymy obiekt Date
        const dateObj = new Date(dateString);
  
        // Opcje do wyświetlenia dnia tygodnia w języku angielskim
        const options = { weekday: 'long' };
        const dayOfWeekEN = dateObj.toLocaleDateString('en-US', options);
  
        // Rozdzielenie daty (rok-miesiąc-dzień) na osobną zmienną
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const dateOnly = `${day}-${month}-${year}`;
  
        // Rozdzielenie godziny (hh:mm) na osobną zmienną
        const hours = String(dateObj.getHours()).padStart(2, '0');
        const minutes = String(dateObj.getMinutes()).padStart(2, '0');
        const timeOnly = `${hours}:${minutes}`;
        return { date: dateOnly, time: timeOnly, dayOfWeek: dayOfWeekEN }
  } 

app.set('view engine', 'ejs');

app.get("/", async (req, res) => {
      res.render("index.ejs");
});
  
app.get('/search-city', async (req, res) => {
    const query = req.query.query;
    if (!query || query.length < 3) {
      return res.json([]);
    }
    try {
      const cities = await searchCity(query);
      res.json(cities);
    } catch (error) {
      res.status(500).json({ error: "Błąd serwera" });
    }
});

app.post('/forecast', async (req, res) => {
    const { city, latitude, longitude } = req.body;
    if (!latitude || !longitude) {
      return res.render("index.ejs", {message: "No coordinates for chosen city."});
    }
    try {
      const weatherData = await getWeather(latitude, longitude);
      //var date = dateAndTime(weatherData.hourly.time);
      //console.log(weatherData.hourly.time);
      //console.log(date);
      res.render("forecast.ejs", { city, weatherData, dateAndTime});
    } catch (error) {
      res.send("Wystąpił błąd przy pobieraniu danych pogodowych.");
    }
});  

app.get("/about", (req, res) => {
    res.render("about.ejs");
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});