const express = require('express');
const app = express();

const path = require('path');
app.use(express.static(path.join(__dirname, 'client')));

// Import data from honk_if_you_haggle database
const fileNameForJSON = '.' + path.sep + 'honk_if_you_haggle_db.json';
const car_market_data = require(fileNameForJSON);

// Returns data about a specific car with a specific id
app.get('/car/:id', function (req, resp) {
    const req_id = req.params.id;   // ID of the car
    
    // Filters data to only find the car with the given id
    let filteredData = car_market_data["cars"].filter(function(car){
        return car.id == req_id
    });
    
    // Return the first entry in the array in the unexpected case that two cars have the same id
    resp.send(JSON.stringify(filteredData[0]));
});

// Returns data about all the cars
app.get('/cars', function (req, resp) {
    let filteredData = car_market_data["cars"]   
    resp.send(JSON.stringify(filteredData));
});

// Export app
module.exports = app;