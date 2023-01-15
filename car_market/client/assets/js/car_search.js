const endpointRoot = 'http://127.0.0.1:8080/'

async function listCars() {
    const response = await fetch(endpointRoot + 'cars?size=10&page=1/')
    const text = await response.text()
    const data = JSON.parse(text)

    carListElt = document.getElementById('carList');
    var carCardTemplate = document.getElementById("carCardTemplate");

    let carList = '';
    for (const carData of data) {
        carList += `<div id="grid" class="col-12 col-lg-6 col-xxl-4">
        <div id="card" class="card">
            <img id="img" src="assets/images/loading.gif" alt="Image of a Toyota Yaris car" class="card-img-top card-car-img">
            <div id="body" class="card-body">
                <h5 id="title" class="card-title">${carData["make"] + " " + carData["model"]}</h5>
                <p id="text" class="card-text">${"Color: " + carData["color"] + ", Price: £" + carData["price"]}</p>
            </div>
        </div>
    </div>`

        // var clone = carCardTemplate.content;
        // var card = clone.querySelector("div").querySelector("div")
        // var body = card.getElementById("body")
        // body.getElementById("title").innerHTML = carData["make"] + " " + carData["model"]
        // body.getElementById("text").innerHTML = "Color: " + carData["color"] + ", Price: £" + parseString(carData["price"])

        //  list += clone;
    }

     carListElt.innerHTML = carList;
    // const listItems = document.querySelectorAll('.recipe_list_item');
    // for (const listItem of listItems) {
    //     listItem.addEventListener('click', (event) => loadRecipe(event.target.textContent));
    // }
}

document.addEventListener('DOMContentLoaded', listCars);