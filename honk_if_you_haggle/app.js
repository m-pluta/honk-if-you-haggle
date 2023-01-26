const express = require('express');
const app = express();

const path = require('path');
app.use(express.static(path.join(__dirname, 'client')));

// Import data from honk_if_you_haggle database
const fileNameForJSON = '.' + path.sep + 'honk_if_you_haggle_db.json';
const DbData = require(fileNameForJSON);

// Returns data about a specific car with a specific id
app.get('/car/:id', function (req, resp) {
    const reqID = req.params.id; // ID of the car

    // Filters data to only find the car with the given id
    const filteredData = DbData.cars.filter(function (car) {
        return car.id === reqID;
    });

    // Return the first entry in the array in the unexpected case that two cars have the same id
    resp.send(JSON.stringify(filteredData[0]));
});

// Returns data about all the cars
app.get('/cars', function (req, resp) {
    const filteredData = DbData.cars;
    resp.send(JSON.stringify(filteredData));
});

// Returns data about all the cars
app.get('/cars/nextID', function (req, resp) {
    let maxID = 0;
    
    for (let i = 0; i < DbData.cars.length; i++) {
        let currID = DbData.cars[i].id;
        if (currID > maxID) {
            maxID = currID;
        }
    }
    resp.send(JSON.stringify(maxID + 1));
});

// Export app
module.exports = app;
