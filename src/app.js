//TODO: DELETE ME
import { cityDataTestObject, weatherDataTestObject } from "./data";

import { COORDS_API_KEY } from "./apikeys.js";

const submitButton = document.getElementById("submit-button");
const input = document.getElementById("search-input");

//reset validity message on input value change
input.addEventListener("input", () => {
  input.setCustomValidity("");
});

submitButton.addEventListener("click", async (evt) => {
  evt.preventDefault();
  input.setCustomValidity("");
  if (input.value) {
    let cityName = input.value;
    let coordinates = await getCoordinates(cityName);
    if (!coordinates) {
      input.setCustomValidity("Cannot find city");
      input.reportValidity();
      return;
    }
    let weatherData = await getWeather(coordinates);
    if (!weatherData) {
      input.setCustomValidity("Cannot get the weather forecast for given city");
      input.reportValidity();
    }
    displayWeather(weatherData);
  } else {
    input.setCustomValidity("Please enter city!");
    input.reportValidity();
    return;
  }
});

async function getCoordinates(city) {
  //request coordinates data by city name
  //TODO: DELETE ME
  return cityDataTestObject;

  const request = new Request(
    `https://api.api-ninjas.com/v1/geocoding?city=${city}`,
    {
      method: "GET",
      headers: { "X-Api-Key": `${COORDS_API_KEY}` },
      contentType: "application/json",
    }
  );
  try {
    const response = await fetch(request);

    if (response.status === 200) {
      let data = await response.json();
      console.log("CITY DATA:");
      console.log(data);
      return data[0];
    }
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function getWeather(coordinates) {
  //TODO: DELETE ME
  return weatherDataTestObject;

  const latitude = coordinates?.latitude;
  const longitude = coordinates?.longitude;
  if (!latitude || !longitude) {
    console.error("Error, no latitude and longitude in provided coordinates");
    return null;
  }

  let url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,visibility&forecast_days=1`;
  try {
    const request = await fetch(url);
    if (request.status !== 200) {
      throw new Error("Request status NOK:" + request.status);
    }
    const data = await request.json();
    console.log("WEATHER DATA:");
    console.log(data);
    data.cityName = coordinates?.name;
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function displayWeather(data) {
  const cityName = data?.cityName;
  const maxTempToday = Math.max(...data?.hourly?.temperature_2m);
  const minTempToday = Math.min(...data?.hourly?.temperature_2m);
  const averageHumidityToday = getAverage(data?.hourly?.relative_humidity_2m);
  const minApparentTempToday = Math.min(...data?.hourly?.apparent_temperature);
  const maxPrecipitationProbability = Math.max(
    ...data?.hourly?.precipitation_probability
  );
  const weatherCode = data?.hourly?.weather_code[12];

  const cityNameDisplay = document.getElementById("city-name");
  const maxTempDisplay = document.getElementById("temp-max");
  const minTempDisplay = document.getElementById("temp-min");
  const averageHumidityDisplay = document.getElementById("avg-humidity");
  const apparentTempDisplay = document.getElementById("max-apparent-temp");
  const precipitationProbabilityDisplay = document.getElementById(
    "precipitation-probability"
  );
  const weatherDescriptionDisplay = document.getElementById(
    "weather-description"
  );

  cityNameDisplay.textContent = cityName.toUpperCase();
  maxTempDisplay.textContent = "Max: " + maxTempToday + "°C";
  minTempDisplay.textContent = "Min: " + minTempToday + "°C";
  averageHumidityDisplay.textContent =
    "Average humidity: " + averageHumidityToday + "°C";
  apparentTempDisplay.textContent =
    "Lowest apparent temperature: " + minApparentTempToday + "°C";
  precipitationProbabilityDisplay.textContent =
    "Precipitation probability: " + maxPrecipitationProbability + "%";
  weatherDescriptionDisplay.textContent = weatherCodeToString(weatherCode);
  
  console.log("City: " + cityName);
  console.log(
    "Max temperature: " + maxTempToday + data?.hourly_units?.temperature_2m
  );
  console.log(
    "Min temperature: " + minTempToday + data?.hourly_units?.temperature_2m
  );
  console.log(
    "Average humidity: " +
      averageHumidityToday +
      data?.hourly_units?.relative_humidity_2m
  );
  console.log(
    "Day apparent temperature: " +
      minApparentTempToday +
      data?.hourly_units?.temperature_2m
  );
  console.log(
    "Max precipitation probability: " + maxPrecipitationProbability + "%"
  );
  console.log("Weather description: " + weatherCodeToString(weatherCode));

  function getAverage(array) {
    let sum = array.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );
    return Math.round(sum / array.length);
  }

  function weatherCodeToString(code) {
    let codeString;
    switch (code) {
      case 0:
        codeString = "Clear sky";
        break;
      case 1:
        codeString = "Mainly clear";
        break;
      case 2:
        codeString = "Partly cloudy";
        break;
      case 3:
        codeString = "Overcast";
        break;
      case 45 || 48:
        codeString = "Fog";
        break;
      case 51 || 53 || 55:
        codeString = "Drizzle";
        break;
      case 56 || 57:
        codeString = "Freezing Drizzle";
        break;
      case 61:
        codeString = "Slight rain";
        break;
      case 63:
        codeString = "Moderate rain";
        break;
      case 65:
        codeString = "Heavy rain";
        break;
      case 66 || 67:
        codeString = "Freezing rain";
        break;
      case 71:
        codeString = "Slight snow fall";
        break;
      case 73:
        codeString = "Moderate snow fall";
        break;
      case 75:
        codeString = "Heavy snow fall";
        break;
      case 77:
        codeString = "Snow grains";
        break;
      case 80 || 81 || 82:
        codeString = "Rain showers";
        break;
      case 85 || 86:
        codeString = "Snow showers";
        break;
      case 80 || 81 || 82:
        codeString = "Rain showers";
        break;
      case 95:
        codeString = "Thunderstorm";
        break;
      case 96 || 99:
        codeString = "Thunderstorm with hail";
        break;
      default:
        codeString = "No data";
        break;
    }
    return codeString;
  }
}

displayWeather(weatherDataTestObject);
