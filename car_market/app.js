const express = require('express');
const app = express();

// Import car_market database
const fileNameForJSON = './car_market_db.json';
const car_market_data = require(fileNameForJSON);

app.get('/car/:id', function (req, resp) {
    const req_id = req.params.id;   // ID of the car
    
    // Filters data to only find the car with the given id
    let filteredData = car_market_data["cars"].filter(function(car){
        return car.id == req_id
    });
    
    // Return the first entry in the array in the unexpected case that two cars have the same id
    resp.send(filteredData[0]);
});
app.get('/cars', function (req, resp) {
    const page_size = req.query.size    // How many items are displayed on each page
    const page = req.query.page         // Which page of items should be displayed
    
    const offset = (page - 1) * page_size;  // Index of the first item to be displayed

    // Slice the data so that it contains only the items on that specific page
    let filteredData = car_market_data["cars"].slice(offset, offset + page_size)    
    
    resp.send(filteredData);
});
app.get('/cars/pages', function (req, resp) {
    const page_size = req.query.size    // How many items are displayed on each page
    
    const number_of_items = Object.values(car_market_data["cars"]).length
    
    const num_of_pages = Math.ceil(number_of_items / page_size)
    
    resp.send(JSON.stringify(num_of_pages));
});

// Export app
module.exports = app;