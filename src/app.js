//TODO: DELETE ME

import { kyivData, weatherData } from "./data";
import { COORDS_API_KEY } from "./apikeys.js";
//TODO: DELETE ME

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
    console.log("COORDINATES:");
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
  //return kyivData;

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
    console.log("RESPONSE:");
    console.log(response);

    if (response.status === 200) {
      let data = await response.json();
      console.log("DATA:");
      console.log(data);
      return data[0];
    }
    console.log(response);
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function getWeather(coordinates) {
  //TODO: DELETE ME
  //return kyivData;

  const latitude = coordinates?.latitude;
  const longitude = coordinates?.longitude;
  if (!latitude || !longitude) {
    console.error("Error, no latitude and longitude in provided coordinates");
    return null;
  }

  let url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,visibility&forecast_days=1`;
  try {
    const request = await fetch(url);
    console.log(request);
    if (request.status !== 200) {
      throw new Error("Request status NOK:" + request.status);
    }
    const data = await request.json();
    console.log("Got weather data");
    console.log(data);
    data.cityName = coordinates?.name;
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

function displayWeather(data) {
  console.log(data);
}
