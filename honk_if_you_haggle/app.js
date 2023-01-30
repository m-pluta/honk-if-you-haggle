// Express Back-end module
const express = require('express');
const app = express();

// UUID module
const { v4: uuidv4 } = require('uuid');

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

// Returns all the cars in order from newest to oldest
app.get('/cars', function (req, resp) {
    // Sorts based on the value of creation_date
    const filteredData = Object.fromEntries(
        Object.entries(DbData.cars)
          .sort((a, b) => b[1].creation_date - a[1].creation_date)
      );

    resp.status(200).json(filteredData);
});

// Adds a new car to the database based on user input
app.post('/cars', function (req, resp) {
    // Generate new UUID
    const id = uuidv4();

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

// Returns all the bids ever made for any car, sorted newest to oldest
app.get('/bids', function (req, resp) {
    const filteredData = Object.fromEntries(
        Object.entries(DbData.bids)
          .sort((a, b) => b[1].timestamp - a[1].timestamp)
      );

    resp.status(200).json(filteredData);
});

// Returns all the bids made for a certain car
app.get('/bids/:id', function (req, resp) {
    const reqID = req.params.id;

    let filteredData = {};
    for (const id in DbData.bids) {
        if (DbData.bids[id].carID === reqID) {
            filteredData[id] = DbData.bids[id];
        }
    }

    filteredData = Object.fromEntries(
        Object.entries(filteredData)
          .sort((a, b) => b[1].timestamp - a[1].timestamp)
      );

    resp.status(200).json(filteredData);
});

// Returns the maximum bid for a certain car
app.get('/bids/:id/max', function (req, resp) {
    const carID = req.params.id;

    let maxBid = 0;
    let maxBidID;

    for (const bidID in DbData.bids) {
        const bidObj = DbData.bids[bidID];
        if (bidObj.bid > maxBid && bidObj.carID === carID) {
            maxBid = bidObj.bid;
            maxBidID = bidID;
        }
    }

    if (maxBidID) {
        resp.status(200).json(DbData.bids[maxBidID]);
    } else {
        resp.status(200).send({});
    }
});

// Returns the number of bids for a certain car
app.get('/bids/:id/num', function (req, resp) {
    const carID = req.params.id;

    let counter = 0;

    for (const bidID in DbData.bids) {
        const bidObj = DbData.bids[bidID];
        if (bidObj.carID === carID) {
            counter++;
        }
    }

    resp.status(200).json({ bids: counter });
});

// Adds a new bid to the data for a certain car
app.post('/bids', function (req, resp) {
    // Generate new UUID
    const id = uuidv4();

    // Add timestamp for the bid
    const details = req.body;
    const currentDate = new Date();
    details.timestamp = currentDate.getTime();

    // Add data about car to the JSON object storing the DB
    DbData.bids[id] = details;

    // Write the DB to the file to update it
    fs.writeFileSync(fileNameForJSON, JSON.stringify(DbData));
    resp.send(DbData.bids);
});

// Export app
module.exports = app;
