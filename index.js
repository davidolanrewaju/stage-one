import express from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

const ip_token = process.env.IPINFO_TOKEN;
const weather_api_key = process.env.WEATHER_API_KEY;

app.get("/", (req, res) => {
  res.json({ message: "Please visit this link: https://stage-one-seven.vercel.app/api/hello" });
});

app.get("/api/hello", async (req, res) => {
  const name = req.query.visitor_name || 'Visitor';
  const client_ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  try {
    const IP_URL = `https://ipinfo.io/${client_ip}/json?token=${ip_token}`;
    const response = await axios.get(IP_URL);
    const locationInfo = await response.data;
    const location = locationInfo.city;
    const longAndLat = locationInfo.loc.split(",");
    const lon = parseFloat(longAndLat[0]);
    const lat = parseFloat(longAndLat[1]);

    const WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weather_api_key}&units=metric`;
    const weather_response = await axios.get(WEATHER_URL);
    const weatherInfo = await weather_response.data;
    const temp = weatherInfo.main.temp;

    res.status(200).json({
      client_ip,
      location,
      greeting: `Hello, ${name}!, the temperature is ${temp} degrees Celcius in ${location}`,
    });
  } catch (error) {
    console.error("Error fetching location info:", error);
    res.status(500).json({ error: "Failed to fetch location info" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
