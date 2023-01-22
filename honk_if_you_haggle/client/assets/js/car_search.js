const endpointRoot = 'http://127.0.0.1:8080/'

function clearCardLayout() {
    carListElt = document.getElementById('carList');
    carListElt.innerHTML = ""
}

async function listCars() {
    const response = await fetch(endpointRoot + 'cars/')
    const text = await response.text()
    const data = JSON.parse(text)

    clearCardLayout()

    carListElt = document.getElementById('carList');

    var carCardTemplate = document.getElementById("carCardTemplate");
    var templateContent = carCardTemplate.content

    for (const carData of data) {
        var copyHTML = document.importNode(templateContent, true);

        copyHTML.querySelector(".card-car-title").textContent = carData["make"] + " " + carData["model"];
        copyHTML.querySelector(".card-car-id").innerHTML = `<strong>ID: </strong> ${carData["id"]}`;
        copyHTML.querySelector(".card-car-year").innerHTML = `<strong>Year: </strong> ${carData["year"]}`;
        copyHTML.querySelector(".card-car-mileage").inner = `<strong>Mileage: </strong> ${carData["mileage"]}`;
        copyHTML.querySelector(".card-car-price").textContent = `£${carData["price"]}`;
        copyHTML.querySelector(".card-car").id = "carID:" + carData["id"]

        carListElt.appendChild(copyHTML);   
    }

    carListElt = document.getElementById('carList');
    const listItems = carListElt.querySelectorAll('.card-car');
    for (const listItem of listItems) {
        listItem.addEventListener('click', (event) => console.log(listItem.id.split(":")[1]));
    }
}

 document.addEventListener('DOMContentLoaded', listCars);