const endpointRoot = 'http://127.0.0.1:8080/'

// Clears all cards currently present in the card-layout
function clearCardLayout() {
    carListElt = document.getElementById('carList');
    carListElt.innerHTML = ""
}


// Makes a fetch request to server to get all car data
// Loads data about each car into a template card
// Appends each card into the card-layout
async function listCars() {
    // Make fetch request for all car data
    const response = await fetch(endpointRoot + 'cars/')
    const text = await response.text()
    const data = JSON.parse(text)

    clearCardLayout()

    const carListElt = document.getElementById('carList');

    var templateContent = document.getElementById("carCardTemplate").content;

    // Creates a card for each car in data
    for (const carData of data) {
        // Copies the HTML from the template in index.html
        var copyHTML = document.importNode(templateContent, true);

        // Modifies each part in the template with the appropriate data
        copyHTML.querySelector(".card-car-title").textContent = carData["make"] + " " + carData["model"];
        copyHTML.querySelector(".card-car-id").innerHTML = `<strong>ID: </strong> ${carData["id"]}`;
        copyHTML.querySelector(".card-car-year").innerHTML = `<strong>Year: </strong> ${carData["year"]}`;
        copyHTML.querySelector(".card-car-mileage").inner = `<strong>Mileage: </strong> ${carData["mileage"]}`;
        copyHTML.querySelector(".card-car-price").textContent = `£${carData["price"]}`;
        copyHTML.querySelector(".card-car").id = "carID:" + carData["id"]

        // Appends card to the card-layout
        carListElt.appendChild(copyHTML);   
    }

    // Attach an on-click event-listener to each so that its id is logged to console when clicked
    const listItems = carListElt.querySelectorAll('.card-car');
    for (const listItem of listItems) {
        listItem.addEventListener('click', (event) => {
            var id = listItem.id.split(":")[1];
            console.log(id)

        })
    }
}


// Purpose: Load all cars into card-layout when DOM loads
 document.addEventListener('DOMContentLoaded', listCars);