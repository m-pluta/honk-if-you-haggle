const express = require('express');
const app = express();

// Import car_market database
const fileNameForJSON = './car_market_db.json';
const car_market_data = require(fileNameForJSON);

app.get('/car/:id', function (req, resp) {
    const id = req.params.id;   // ID of the car
    
    // Filters data to only find the car with the given id
    let filteredData = car_market_data["cars"].filter(function(item){
        return item.id == id
    });
    
    // Return the first entry in the array in the unexpected case that two cars have the same id
    resp.send(filteredData[0]);
});

// Export app
module.exports = app;