import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';

// Business Logic
function toFahrenheit(temp) {
  // Conversion Kelvin to Fahrenheit: °F = (K − 273.15) × 1.8 + 32
  temp = (temp - 273.15) * 1.8 + 32;
  return temp;
}

function getCity(zip) {
  let request = new XMLHttpRequest();
  zip = parseInt(zip);
  const url = `http://api.openweathermap.org/geo/1.0/zip?zip=${zip}&appid=${process.env.API_KEY}`;
  
  request.addEventListener("loadend", function() {
    const response = JSON.parse(this.responseText);
    if (this.status === 200) {
      let city = response.name;
      getWeather(city);
    }
  }); 
  
  request.open("GET", url, true);
  request.send();
}

function getWeather(city) {
  let request = new XMLHttpRequest();
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}`;

  request.addEventListener("loadend", function() {
    const response = JSON.parse(this.responseText);
    if (this.status === 200) {
      printElements(response, city);
    }
  });

  request.open("GET", url, true);
  request.send();
}

// UI Logic

function printElements(apiResponse, city) {
  let tempF = toFahrenheit(apiResponse.main.temp);
  document.querySelector('#showResponse').innerText = `The humidity in ${city} is ${apiResponse.main.humidity}%.
  The temperature is ${tempF} degrees Fahrenheit.`;
}

function handleFormSubmission(event) {
  event.preventDefault();
  let city = document.querySelector('#location').value;
  const zip = document.querySelector('#zip-code').value;
  document.querySelector('#zip-code').value = null;
  document.querySelector('#location').value = null;
  if (!city) {
    getCity(zip);
  } else {
    getWeather(city);
  }
}

window.addEventListener("load", function() {
  document.querySelector('form').addEventListener("submit", handleFormSubmission);
});