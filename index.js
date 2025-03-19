import express from "express";
import bodyParser from "body-parser";
import * as utils from "./utilities.js";

const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
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
      const cities = await utils.searchCity(query);
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
      const weatherData = await utils.getHourlyWeather(latitude, longitude);
      res.render("forecast.ejs", { city, weatherData, utils});
    } catch (error) {
      res.send("Error while fetching weather data.");
    }
});

app.get("/about", (req, res) => {
    res.render("about.ejs");
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});