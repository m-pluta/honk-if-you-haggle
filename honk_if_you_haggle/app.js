// Express Back-end module
const express = require('express');
const app = express();

// UUID module
const { uuid } = require('uuidv4');

// Node.js file system & path module for working with files and directory paths
const fs = require('fs');
const path = require('path');

// Middleware function used to server the contents of the client directory
app.use(express.static(path.join(__dirname, 'client')));

// JSON parsing middleware
app.use(express.json());

// Import data from honk_if_you_haggle database
const fileNameForJSON = '.' + path.sep + 'honk_if_you_haggle_db.json';
const DbData = require(fileNameForJSON);

// Returns data about a specific car with a specific id
app.get('/cars/:id', function (req, resp) {
    const reqID = req.params.id;

    // Find the car with the given id
    const filteredData = DbData.cars[reqID];

    // Return the car's data in JSON format
    resp.status(200).json(filteredData);
});

// Returns data about all the cars
app.get('/cars', function (req, resp) {
    const filteredData = DbData.cars;
    resp.status(200).json(filteredData);
});

// Adds a new car to the database based on user input
app.post('/cars', function (req, resp) {
    // Generate new UUID
    const id = uuid();

    // Add timestamp for creation_date to the car
    const details = req.body;
    const currentDate = new Date();
    details.creation_date = currentDate.getTime();

    // Add data about car to the JSON object storing the DB
    DbData.cars[id] = details;

    // Write the DB to the file to update it
    fs.writeFileSync(fileNameForJSON, JSON.stringify(DbData));

    resp.send(DbData.cars);
});

// Export app
module.exports = app;
