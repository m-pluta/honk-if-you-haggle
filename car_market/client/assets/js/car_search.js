const endpointRoot = 'http://127.0.0.1:8080/'

async function listCars() {
    const response = await fetch(endpointRoot + 'cars?size=10&page=1/')
    const text = await response.text()
    const data = JSON.parse(text)

    carListElt = document.getElementById('carList');

    var carCardTemplate = document.getElementById("carCardTemplate");
    var templateContent = carCardTemplate.content

    for (const carData of data) {
        var copyHTML = document.importNode(templateContent, true);

        copyHTML.querySelector(".card-title").textContent = carData["make"] + " " + carData["model"];
        copyHTML.querySelector(".card-text").textContent = "Color: " + carData["color"] + ", Price: £" + carData["price"];
    
        carListElt.appendChild(copyHTML);
    }

    const listItems = carListElt.querySelectorAll('.card');
    for (const listItem of listItems) {
        listItem.addEventListener('click', (event) => console.log("click"));
    }
}

 document.addEventListener('DOMContentLoaded', listCars);