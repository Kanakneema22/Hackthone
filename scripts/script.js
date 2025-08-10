const displayUserName = () => {
  const userNameContainer = document.getElementById("userNameContainer");
  const userName = localStorage.getItem("userName") || "User";
  userNameContainer.textContent = `${userName}!`;
};

const getUserName = async () => {
  const { value: userName } = await Swal.fire({
    title: "Enter your name",
    input: "text",
    inputPlaceholder: "Your name",
    confirmButtonText: "Submit",
    allowOutsideClick: false,
    inputValidator: (value) => {
      if (!value) return "Please enter your name!";
    },
  });

  if (userName) {
    localStorage.setItem("userName", userName);
    displayUserName();
  }
};

localStorage.getItem("userName") ? displayUserName() : getUserName();

// Show current weekday and time
const displayTime = () => {
  const timeElement = document.getElementById("current-time");
  const now = new Date();

  const day = now.toLocaleDateString("en-US", { weekday: "long" });
  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  timeElement.textContent = `${day}, ${time}`;
};

setInterval(displayTime, 1000);
displayTime(); // Run immediately

// Get coordinates using browser geolocation
const getLocation = (callback) => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      callback({ latitude, longitude });
    },
    (error) => {
      console.error("Error getting location:", error);
      document.getElementById("location").textContent =
        "Location permission denied";
    }
  );
};

// Fetch and display user's city or best match
const getCurrentCity = () => {
  getLocation((coords) => {
    fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`
    )
      .then((response) => response.json())
      .then((data) => {
        const address = data.address;

        // Extended fallback to handle neighborhoods like Rohini
        const location =
          address.suburb ||
          address.neighbourhood ||
          address.city ||
          address.town ||
          address.village ||
          address.hamlet ||
          address.county ||
          address.state_district ||
          address.state ||
          "Unknown location";

        document.getElementById("location").textContent = location;
      })
      .catch((error) => {
        console.error("Error fetching location:", error);
        document.getElementById("location").textContent =
          "Error fetching location";
      });
  });
};

// Initialize location
getCurrentCity();

async function getCurrentWeather(latitude, longitude) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=bd1744d0994cedab142e7beb7cdf5b49`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return {
    temperature: (data.main.temp - 273.15).toFixed(2), // Convert Kelvin to Celsius
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    precipitation: data.rain ? data.rain["1h"] || 0 : 0, // Rain volume in the last hour
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
  };
}

async function displayWeather() {
  const temperatureElement = document.getElementById("temperature");
  const weatherDescriptionElement = document.getElementById(
    "weather-description"
  );
  const precipitationElement = document.getElementById("precipitation");
  const humidityElement = document.getElementById("humidity");
  const windSpeedElement = document.getElementById("wind-speed");

  try {
    const coords = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position.coords),
        (error) => reject(error)
      );
    });

    const weatherData = await getCurrentWeather(
      coords.latitude,
      coords.longitude
    );

    temperatureElement.textContent = `${weatherData.temperature} °C`;
    weatherDescriptionElement.textContent =
      weatherData.description.charAt(0).toUpperCase() +
      weatherData.description.slice(1);
    precipitationElement.textContent = `Precipitation: ${weatherData.precipitation} mm`;
    humidityElement.textContent = `Humidity: ${weatherData.humidity}%`;
    windSpeedElement.textContent = `Wind Speed: ${weatherData.windSpeed} m/s`;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    const weatherElement = document.getElementById("weather-container");
    weatherElement.textContent = "Unable to fetch weather data.";
  }
}

displayWeather();