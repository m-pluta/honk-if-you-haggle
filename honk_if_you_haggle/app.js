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

// Returns all the cars in order from newest to oldest
app.get('/cars', function (req, resp) {
    // Sorts based on the value of creation_date
    const filteredData = Object.fromEntries(
        Object.entries(DbData.cars)
          .sort((a, b) => b[1].creation_date - a[1].creation_date)
      );

    if (Object.keys(filteredData).length !== 0) {
        // If any cars are present then return them all
        resp.status(200).json(filteredData);
    } else {
        // Else return an appropriate message
        resp.status(200).send({ message: 'No cars found' });
    }
});

// Returns data about a specific car with a specific id
app.get('/cars/:id', function (req, resp) {
    const carID = req.params.id;

    // Attempts to access the car with the given id
    const carFound = DbData.cars[carID];

    if (carFound) {
        // If a car was found then return its data
        resp.status(200).json(carFound);
    } else {
        // Else return an Error 404
        resp.status(404).send({ message: 'Car not found' });
    }
});

// Adds a new car to the database
app.post('/cars', function (req, resp) {
    // Generate new UUID for the new car
    const generatedID = uuidv4();

    const details = req.body;

    // Create and add creation_date to the details of the car
    const currentDate = new Date();
    details.creation_date = currentDate.getTime();

    // Add the car and its details to the DB
    DbData.cars[generatedID] = details;

    // Write the contents of the DB to the file
    fs.writeFileSync(fileNameForJSON, JSON.stringify(DbData));

    // Return a JSON object containing the newly created car to the user
    resp.status(200).send({ [generatedID]: DbData.cars[generatedID] });
});

// Returns all the bids ever made for any car, sorted newest to oldest
app.get('/bids', function (req, resp) {
    // Sorts based on the value of timestamp
    const filteredData = Object.fromEntries(
        Object.entries(DbData.bids)
          .sort((a, b) => b[1].timestamp - a[1].timestamp)
      );

    if (Object.keys(filteredData).length !== 0) {
        // If any bids are present then return them all
        resp.status(200).json(filteredData);
    } else {
        // Else return an appropriate message
        resp.status(200).send({ message: 'No bids found' });
    }
});

// Returns all the bids for a specific car, sorted newest to oldest
app.get('/bids/:id', function (req, resp) {
    const carID = req.params.id;

    // Attempts to access the car with id = carID
    const carFound = DbData.cars[carID];
    // If car was found then continue, if not then return an appropriate message
    if (carFound) {
        // Filter the data to include only the bids belonging to the specific car
        let filteredData = {};
        for (const bidID in DbData.bids) {
            if (DbData.bids[bidID].carID === carID) {
                filteredData[bidID] = DbData.bids[bidID];
            }
        }

        // Sorts based on the value of timestamp
        filteredData = Object.fromEntries(
            Object.entries(filteredData)
            .sort((a, b) => b[1].timestamp - a[1].timestamp)
        );

        if (Object.keys(filteredData).length !== 0) {
            // If any bids are present then return them all
            resp.status(200).json(filteredData);
        } else {
            // Else return an appropriate message
            resp.status(200).send({ message: 'No bids found' });
        }
    } else {
        resp.status(404).send({ message: 'Car not found' });
    }
});

// Returns the bid with maximum value of `bid` for a specific car
app.get('/bids/:id/max', function (req, resp) {
    const carID = req.params.id;

    // Attempts to access the car with id = carID
    const carFound = DbData.cars[carID];
    // If the car was found then continue, if not then return an appropriate message
    if (carFound) {
        let maxBid = 0;
        let maxBidID; // Target variable i.e. value of this is used later

        // Find the ID of the bid with the largest value of `bid`
        for (const bidID in DbData.bids) {
            const bidObj = DbData.bids[bidID];
            if (bidObj.bid > maxBid && bidObj.carID === carID) {
                maxBid = bidObj.bid;
                maxBidID = bidID;
            }
        }

        if (maxBidID) {
            // If an ID for the max bid was found then return the bid object
            resp.status(200).json(DbData.bids[maxBidID]);
        } else {
            // Else return an appropriate message
            resp.status(200).send({ message: 'No bids found' });
        }
    } else {
        // Else, return an Error 404
        resp.status(404).send({ message: 'Car not found' });
    }
});

// Returns the number of bids for a specific car
app.get('/bids/:id/num', function (req, resp) {
    const carID = req.params.id;

    // Attempts to access the car with id = carID
    const carFound = DbData.cars[carID];
    // If the car was found then continue, if not then return an error 404
    if (carFound) {
        let counter = 0;

        // Count the number of bids for that specific car
        for (const bidID in DbData.bids) {
            const bidObj = DbData.bids[bidID];
            if (bidObj.carID === carID) {
                counter++;
            }
        }

        if (counter !== 0) {
            resp.status(200).json({ bids: counter });
        } else {
            resp.status(200).send({ message: 'No bids found' });
        }
    } else {
        resp.status(404).send({ message: 'Car not found' });
    }
});

// Adds a new bid to the data for a specific car
app.post('/bids', function (req, resp) {
    // Generate new UUID for the new bid
    const generatedID = uuidv4();

    const details = req.body;

    // Add timestamp to the details of the bid
    const currentDate = new Date();
    details.timestamp = currentDate.getTime();

    // Add the bid and its details to the DB
    DbData.bids[generatedID] = details;

    // Write the contents of the DB to the file
    fs.writeFileSync(fileNameForJSON, JSON.stringify(DbData));

    // Return a JSON object containing the newly created bid to the user
    resp.status(200).send({ [generatedID]: DbData.bids[generatedID] });
});

// Export app
module.exports = app;
