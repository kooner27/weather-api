// node modules: express, https, body-parser
const express = require("express");
const app = express();
const https = require("https");
const bodyParser = require("body-parser");

app.set("view engine", "ejs");


// the public folder contains static files
// these files will be served to the user using express
// the files are therefore publicly accessible
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// When TCP connection is established on the specified port on our Server
// the client sends a get request
// we serve the index webpage

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

// after inputing data the client sends a post request
// using this data which includes the city and country
// make a https request to the api endpoint from our server
// retrieve the weather data
// parse the data
// send the necessary data back to the user from our server

app.post("/", function(req, res) {
  var city = req.body.City;
  var country = req.body.Country;
  city = city.charAt(0).toUpperCase() + city.slice(1);
  country = country.toUpperCase();

  const apiKey = "e45ea83cacc9ba612c240d647e020b0d";
  var url = "https://api.openweathermap.org/data/2.5/weather";
  const query = city + "," + country;
  url = url + "?q=" + query + "&appid=" + apiKey + '&units=metric';
  console.log(url);

  https.get(url, function(response) {
    console.log(response.statusCode);

    response.on("data", function(data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const description = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      var location = city + ", " + country;
      res.locals.imageURL = imageURL;
      res.render("data", {
        location: location,
        temp: temp,
        description: description
      });
    })
  })


});

app.listen(3000, function() {
  console.log("Server is running on port 3000");
});
