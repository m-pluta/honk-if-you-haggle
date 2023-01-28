/* eslint-disable space-before-function-paren */
const endpointRoot = 'http://127.0.0.1:8080/';

// Clears all cards currently present in the card-layout
function clearCardLayout() {
    const carListElt = document.getElementById('carList');
    carListElt.innerHTML = '';
}

/*
 Makes a fetch request to server to get all car data
 Loads data about each car into a template card
 Appends each card into the card-layout
 Code from: https://web.dev/fetch-api-error-handling/
*/
async function loadCars() {
    let data;

    // Make the GET request and handle errors
    try {
        const response = await fetch(endpointRoot + 'cars/');
        data = await response.json();
    } catch (error) {
        if (error instanceof SyntaxError) {
            // Unexpected token < in JSON
            console.log('There was a SyntaxError', error);
        } else {
            console.log('There was an error', error);
        }
    }

    // Handle the case where data was fetched successfully
    if (data) {
        console.log('Use the JSON here!');

        clearCardLayout();

        const carListElt = document.getElementById('carList');

        const templateContent = document.getElementById('carCardTemplate').content;

        // Create a card for each car in data
        for (const key in data) {
            const carData = data[key];

            // Copy the HTML from the template in index.html
            const copyHTML = document.importNode(templateContent, true);

            // Modify each part in the template with the appropriate data
            copyHTML.querySelector('.card-car-title').textContent = carData.make + ' ' + carData.model;
            copyHTML.querySelector('.card-car-year').innerHTML = `<strong>Year: </strong> ${carData.year}`;
            copyHTML.querySelector('.card-car-mileage').innerHTML = `<strong>Mileage: </strong> ${carData.mileage}`;
            copyHTML.querySelector('.card-car-price').textContent = `£${carData.price}`;
            copyHTML.querySelector('.card-car').id = 'carID:' + key;

            // Append card to the card-layout
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
}

// Loads different page which shows details about the spcific car clicked
async function loadCar(id) {
    const websiteBody = document.getElementById('mainWebsiteBody');

    // Visually hide main website body
    websiteBody.classList.add('visually-hidden');

    // Fetch data about specific car
    const response = await fetch(endpointRoot + 'cars/' + id);
    const text = await response.text();

    // eslint-disable-next-line no-unused-vars
    const data = JSON.parse(text);

    // Insert fetched data into DOM
}

function attachModalEventListeners() {
    attachValidationListeners();
    attachClearButtonListener();
    attachSubmitButtonListener();
}

function attachValidationListeners() {
    // Get DOM element for image selection
    const formImage = document.getElementById('validationModalImage');

    // Attach on-click listener
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

    // Define RegEx Literals
    const regexLettersWhitespace = /^(?=\S)[A-Za-z\s]+$/;
    const regexLettersWhitespaceNumbers = /^(?=\S)[A-Za-z0-9\s]+$/;
    const regexNumbers = /^[0-9]+$/;
    const regexPrice = /^£[0-9]+(,[0-9]{3})*$/;

    // Get each input element from the DOM
    const formMake = document.getElementById('validationModalMake');
    const formModel = document.getElementById('validationModalModel');
    const formYear = document.getElementById('validationModalYear');
    const formMileage = document.getElementById('validationModalMileage');
    const formColour = document.getElementById('validationModalColour');
    const formPrice = document.getElementById('validationModalPrice');

    // Attach listener to each input element which changes validity depending on RegEx match
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

// Changes the validity of a given input DOM element based on the value of valid
function changeValidity(form, valid) {
    if (valid) {
        form.classList.remove('is-invalid');
        form.classList.add('is-valid');
    } else {
        form.classList.remove('is-valid');
        form.classList.add('is-invalid');
    }
}

// Attaches on-click listener to the clear button in the modal
function attachClearButtonListener() {
    const btnClear = document.getElementById('btnModalClear');

    btnClear.addEventListener('click', (event) => {
        // All the input DOM element in the modal begin with validationModal
        // These are the suffixes that go after this prefix
        const elementSuffixes = ['Image', 'Make', 'Model', 'Year', 'Mileage', 'Colour', 'Price'];

        for (let i = 0; i < elementSuffixes.length; i++) {
            // Get the specific DOM input element
            const elementString = 'validationModal' + elementSuffixes[i];
            const element = document.getElementById(elementString);

            // Clear value and reset validity feedback
            element.value = '';
            element.classList.remove('is-valid');
            element.classList.remove('is-invalid');
        }
    });
}

async function attachSubmitButtonListener() {
    const newCarForm = document.getElementById('newCarForm');
    const btnSubmit = document.getElementById('btnModalSubmit');

    btnSubmit.addEventListener('click', async function (event) {
        // eslint-disable-next-line no-undef
        const data = new FormData(newCarForm);

        // Convert from FormData to JSON
        // https://stackoverflow.com/questions/41431322/how-to-convert-formdata-html5-object-to-json
        const dataJSON = JSON.stringify(Object.fromEntries(data));

        // eslint-disable-next-line no-unused-vars
        const response = await fetch(endpointRoot + 'cars/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: dataJSON
        });
        loadCars();
    });
}

// Purpose: Load all cars into card-layout when DOM loads
document.addEventListener('DOMContentLoaded', loadCars);

// Purpose: Attach modal on-click event listeners
document.addEventListener('DOMContentLoaded', attachModalEventListeners);