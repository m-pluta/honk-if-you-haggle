const express = require('express');
const app = express();
const { uuid } = require('uuidv4');

const fs = require('fs');

const path = require('path');
app.use(express.static(path.join(__dirname, 'client')));

app.use(express.json());

// Import data from honk_if_you_haggle database
const fileNameForJSON = '.' + path.sep + 'honk_if_you_haggle_db.json';
const DbData = require(fileNameForJSON);

// Returns data about a specific car with a specific id
app.get('/cars/:id', function (req, resp) {
    const reqID = req.params.id; // ID of the car

    // Finds the car with the given id
    const filteredData = DbData.cars[reqID];

    // Returns the car's data in JSON format
    resp.status(200).json(filteredData);
});

// Returns data about all the cars
app.get('/cars', function (req, resp) {
    const filteredData = DbData.cars;
    resp.status(200).json(filteredData);
});

app.post('/cars', function (req, resp) {
    const id = uuid();
    const details = req.body;

    DbData.cars[id] = details;

    fs.writeFileSync(fileNameForJSON, JSON.stringify(DbData));
    resp.send(DbData.cars);
});

// Export app
module.exports = app;
