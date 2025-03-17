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
          hourly: 'temperature_2m,precipitation'
        }
      });
      return response.data;
    } catch (error) {
      console.error("Błąd przy pobieraniu pogody:", error);
      throw error;
    }
  }

app.set('view engine', 'ejs');

app.get("/", async (req, res) => {
    const userInput = req.body.cities
    try {
      const cities = await searchCity(userInput);
      //console.log(cities); 
      res.render("index.ejs", { cities: cities });
    } catch (error) {
      console.error("Error getting City data:", error);
      res.render("index.ejs", { cities: [] });
    }
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
      return res.send("Brak współrzędnych dla wybranego miasta.");
    }
    try {
      const weatherData = await getWeather(latitude, longitude);
      res.render("forecast.ejs", { city, weatherData });
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