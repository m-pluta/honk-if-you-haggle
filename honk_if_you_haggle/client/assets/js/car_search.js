const endpointRoot = 'http://127.0.0.1:8080/';

// Clears all cards currently present in the card-layout
function clearCardLayout () {
    const carListElt = document.getElementById('carList');
    carListElt.innerHTML = '';
}

// Makes a fetch request to server to get all car data
// Loads data about each car into a template card
// Appends each card into the card-layout
async function listCars () {
    // Make fetch request for all car data
    const response = await fetch(endpointRoot + 'cars/');
    const text = await response.text();
    const data = JSON.parse(text);

    clearCardLayout();

    const carListElt = document.getElementById('carList');

    const templateContent = document.getElementById('carCardTemplate').content;

    // Creates a card for each car in data
    for (const carData of data) {
        // Copies the HTML from the template in index.html
        const copyHTML = document.importNode(templateContent, true);

        // Modifies each part in the template with the appropriate data
        copyHTML.querySelector('.card-car-title').textContent = carData.make + ' ' + carData.model;
        copyHTML.querySelector('.card-car-id').innerHTML = `<strong>ID: </strong> ${carData.id}`;
        copyHTML.querySelector('.card-car-year').innerHTML = `<strong>Year: </strong> ${carData.year}`;
        copyHTML.querySelector('.card-car-mileage').inner = `<strong>Mileage: </strong> ${carData.mileage}`;
        copyHTML.querySelector('.card-car-price').textContent = `£${carData.price}`;
        copyHTML.querySelector('.card-car').id = 'carID:' + carData.id;

        // Appends card to the card-layout
        carListElt.appendChild(copyHTML);
    }

    // Attach an on-click event-listener to each so that its id is logged to console when clicked
    const listItems = carListElt.querySelectorAll('.card-car');
    for (const listItem of listItems) {
        listItem.addEventListener('click', (event) => {
            const id = listItem.id.split(':')[1];
            console.log(id);
            loadCar(id);
        });
    }
}

async function loadCar (id) {
    const websiteBody = document.getElementById('mainWebsiteBody');

    // Visually hide main website body
    websiteBody.classList.add('visually-hidden');

    // Fetch data about specific car
    const response = await fetch(endpointRoot + 'car/' + id);
    const text = await response.text();
    const data = JSON.parse(text);

    // Insert fetched data into DOM
}

function attachModalEventListeners () {
    attachValidationListeners();
    attachClearButtonListener();
}

function attachValidationListeners () {
    const regexLettersWhitespace = /^(?=\S)[A-Za-z\s]+$/;
    const regexLettersWhitespaceNumbers = /^(?=\S)[A-Za-z0-9\s]+$/;
    const regexNumbers = /^[0-9]+$/;
    const regexPrice = /^£[0-9]+(,[0-9]{3})*$/;

    const formImage = document.getElementById('validationModalImage');
    const formMake = document.getElementById('validationModalMake');
    const formModel = document.getElementById('validationModalModel');
    const formYear = document.getElementById('validationModalYear');
    const formMileage = document.getElementById('validationModalMileage');
    const formColour = document.getElementById('validationModalColour');
    const formPrice = document.getElementById('validationModalPrice');

    formImage.addEventListener('input', (event) => {
        const path = formImage.value;
        const arr = path.split('.');
        const regex = /^jpg|jpeg|png|webp$/;
        if (regex.test(arr[arr.length - 1])) {
            formImage.classList.remove('is-invalid');
            formImage.classList.add('is-valid');
        } else {
            formImage.classList.remove('is-valid');
            formImage.classList.add('is-invalid');
        }
    });
    formMake.addEventListener('input', (event) => {
        changeValidity(formMake, regexLettersWhitespace.test(formMake.value.trim()));
    });
    formModel.addEventListener('input', (event) => {
        changeValidity(formModel, regexLettersWhitespaceNumbers.test(formModel.value.trim()));
    });
    formYear.addEventListener('input', (event) => {
        changeValidity(formYear, regexNumbers.test(formYear.value.trim()));
    });
    formMileage.addEventListener('input', (event) => {
        changeValidity(formMileage, regexNumbers.test(formMileage.value.trim()));
    });
    formColour.addEventListener('input', (event) => {
        changeValidity(formColour, regexLettersWhitespace.test(formColour.value.trim()));
    });
    formPrice.addEventListener('input', (event) => {
        changeValidity(formPrice, regexPrice.test(formPrice.value.trim()));
    });
}

function changeValidity (form, valid) {
    if (valid) {
        form.classList.remove('is-invalid');
        form.classList.add('is-valid');
    } else {
        form.classList.remove('is-valid');
        form.classList.add('is-invalid');
    }
}

function attachClearButtonListener () {
    const btnClear = document.getElementById('btnModalClear');

    btnClear.addEventListener('click', (event) => {
        const elementSuffixes = ['Image', 'Make', 'Model', 'Year', 'Mileage', 'Colour', 'Price'];

        for (let i = 0; i < elementSuffixes.length; i++) {
            const elementString = 'validationModal' + elementSuffixes[i];
            const element = document.getElementById(elementString);

            element.value = '';
            element.classList.remove('is-valid');
            element.classList.remove('is-invalid');
        }
    });
}

// Purpose: Load all cars into card-layout when DOM loads
 document.addEventListener('DOMContentLoaded', listCars);

 // Purpose: Attach modal on-click event listeners
 document.addEventListener('DOMContentLoaded', attachModalEventListeners);
