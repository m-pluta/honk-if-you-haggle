/* eslint-disable space-before-function-paren */
const endpointRoot = 'http://127.0.0.1:8080/';
let currentlyLoadedCar = '';

// Clears all cards currently present in the card-layout
function clearCardLayout() {
    const carListElt = document.getElementById('carList');
    carListElt.innerHTML = '';
}

/*
 Load all cars in the DB into the DOM
 Code from: https://web.dev/fetch-api-error-handling/
*/
async function loadCars() {
    let data, response;

    // Make the GET request and handle errors
    try {
        response = await fetch(endpointRoot + 'cars/');
        data = await response.json();
    } catch (error) {
        if (error instanceof SyntaxError) {
            // There was a SyntaxError
        } else {
            showNetworkErrorModal();
        }
    }

    // Update DOM depending on the response sent from the server
    if (response?.ok) {
        clearCardLayout();

        // carList will store all the cards and templateContent is template for each card
        const carListElt = document.getElementById('carList');
        const templateContent = document.getElementById('carCardTemplate').content;

        // Create a card for each car
        for (const key in data) {
            const carData = data[key];

            // Copy the HTML from the template
            const copyHTML = document.importNode(templateContent, true);

            // Modify each part in the template with the appropriate data
            // Name of the car
            const carFullName = capitalise(carData.make + ' ' + carData.model);

            // Update all the text fields in the card
            copyHTML.querySelector('.card-car-title').textContent = carFullName;
            copyHTML.querySelector('.card-car-year').innerHTML = `<strong>Year: </strong> ${carData.year}`;
            copyHTML.querySelector('.card-car-mileage').innerHTML = `<strong>Mileage: </strong> ${carData.mileage}`;
            copyHTML.querySelector('.card-car-price').textContent = `£${carData.price}`;
            copyHTML.querySelector('.card-car').id = 'carID:' + key;

            // Update the image in the card
            copyHTML.querySelector('.spinner-border').classList.add('visually-hidden');
            copyHTML.querySelector('.card-img-rounded').classList.remove('visually-hidden');
            copyHTML.querySelector('.card-img-rounded').src = carData.image;
            copyHTML.querySelector('.card-img-rounded').alt = 'Image of ' + carFullName;

            // Append card to the Card Layout
            carListElt.appendChild(copyHTML);
        }

        // Attach an onClick Listener to each card so that the user can navigate load in specific cars on another page
        const listCards = carListElt.querySelectorAll('.card-car');
        for (const card of listCards) {
            card.addEventListener('click', (event) => {
                // ID of the car to load in is stored within each card in the DOM
                const id = card.id.split(':')[1];
                loadCar(id);
            });
        }

        // Scroll the user to the top of the page on reload
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }
}

// Switch to different page which shows details about the specific car clicked
async function loadCar(id) {
    let data, response;

    // Make fetch request and handle any network errors
    try {
        response = await fetch(endpointRoot + 'cars/' + id);
        data = await response.json();
    } catch (error) {
        if (error instanceof SyntaxError) {
            // There was a SyntaxError
        } else {
            showNetworkErrorModal();
        }
    }

    // Update DOM depending on the response and data sent from the server
    if (response?.ok) {
        currentlyLoadedCar = id;

        switchtoOneCarViewPage();

        // Get references to each element in the DOM
        const oneCarViewImage = document.getElementById('oneCarViewImage');
        const oneCarViewCarTitle = document.getElementById('oneCarViewCarTitle');
        const oneCarViewBuyPrice = document.getElementById('oneCarViewBuyPrice');
        const oneCarViewMake = document.getElementById('oneCarViewMake');
        const oneCarViewModel = document.getElementById('oneCarViewModel');
        const oneCarViewYear = document.getElementById('oneCarViewYear');
        const oneCarViewMileage = document.getElementById('oneCarViewMileage');
        const oneCarViewColour = document.getElementById('oneCarViewColour');
        const oneCarViewDate = document.getElementById('oneCarViewDate');

        // Name of the car
        const carFullName = capitalise(data.make + ' ' + data.model);
        oneCarViewCarTitle.innerText = carFullName;

        // Load image into the DOM
        oneCarViewImage.src = data.image;
        oneCarViewImage.alt = 'Image of ' + carFullName;

        // Specify the values of all the other text data fields
        oneCarViewBuyPrice.innerText = data.price;
        oneCarViewMake.innerText = capitalise(data.make);
        oneCarViewModel.innerText = capitalise(data.model);
        oneCarViewYear.innerText = data.year;
        oneCarViewMileage.innerText = data.mileage;
        oneCarViewColour.innerText = capitalise(data.color);
        oneCarViewDate.innerText = timestampToString(data.creation_date);

        // Load all the dynamic data about the bids on the car
        loadBidInfo(id);

        // Scroll the user to the top of the page on reload
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }
}

// Update the bid info on the OneCarView page
function loadBidInfo (id) {
    loadBidInfoMax(id);
    loadBidInfoNum(id);
}
// Update the DOM element which shows the current highest bid on a car listing
async function loadBidInfoMax (id) {
    let data, response;

    // Make fetch request and handle any network errors
    try {
        response = await fetch(endpointRoot + 'bids/' + id + '/max/');
        data = await response.json();
    } catch (error) {
        if (error instanceof SyntaxError) {
            // There was a SyntaxError
        } else {
            showNetworkErrorModal();
        }
    }

    // Update DOM depending on the response and data sent from the server
    const oneCarViewBidPrice = document.getElementById('oneCarViewBidPrice');
    if (response?.ok) {
        if (data?.message === 'No bids found') {
            oneCarViewBidPrice.innerText = 'No bids made yet';
        } else {
            oneCarViewBidPrice.innerText = '£' + data.bid;
        }
    } else if (response?.status === 404) {
        // 'Car not found'
    }
}
// Update the DOM element which shows the number of bids a car listing has
async function loadBidInfoNum (id) {
    let data, response;

    // Make fetch request and handle any network errors
    try {
        response = await fetch(endpointRoot + 'bids/' + id + '/num/');
        data = await response.json();
    } catch (error) {
        if (error instanceof SyntaxError) {
            // There was a SyntaxError
        } else {
            showNetworkErrorModal();
        }
    }

    // Update DOM depending on the response and data sent from the server
    const lblNumberOfBids = document.getElementById('lblNumberOfBids');
    if (response?.ok) {
        if (data?.message === 'No bids found') {
            lblNumberOfBids.innerText = 0;
        } else {
            lblNumberOfBids.innerText = data.bids;
        }
    } else if (response?.status === 404) {
        // 'Car not found'
    }
}

function showNetworkErrorModal() {
    // eslint-disable-next-line no-undef
    const myModal = new bootstrap.Modal(document.getElementById('lostConnectionModal'), {
        keyboard: false
        });
    myModal.show();
}

function switchtoMainPage () {
    // Clear current state of page

    const websiteBody = document.getElementById('mainWebsiteBody');
    const oneCarViewBody = document.getElementById('oneCarViewBody');

    // Visually hide main website body
    websiteBody.classList.remove('visually-hidden');
    oneCarViewBody.classList.add('visually-hidden');

    loadCars();
}

function switchtoOneCarViewPage () {
    // Clear current state of page

    const websiteBody = document.getElementById('mainWebsiteBody');
    const oneCarViewBody = document.getElementById('oneCarViewBody');

    // Visually hide main website body
    websiteBody.classList.add('visually-hidden');
    oneCarViewBody.classList.remove('visually-hidden');
}

// Capitalises every word (sequential characters separated by whitespace) of a given input string
function capitalise(str) {
    const arr = str.split(' ');
    for (let i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }
    return arr.join(' ');
}

function timestampToString(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-UK') + ' ' + date.toLocaleTimeString('en-UK');
}

// All the input DOM elements in the modals begin with validationModal
// These are the suffixes that go after this prefix
const newCarModalInputElmtNames = ['Image', 'Make', 'Model', 'Year', 'Mileage', 'Colour', 'Price'];
const placeBidModalInputElmtNames = ['Username', 'Bid'];

function attachNavBarListeners() {
    const btnNavBarBrand = document.getElementById('btnNavBarBrand');
    btnNavBarBrand.addEventListener('click', (event) => {
        switchtoMainPage();
    });
}

function attachOneCarViewListeners() {
    const btnModalPlaceBid = document.getElementById('btnModalPlaceBid');
    const btnViewBids = document.getElementById('btnViewBids');
    const btnPlaceBid = document.getElementById('btnPlaceBid');

    btnModalPlaceBid.addEventListener('click', async function (event) {
        // Check validity of input
        if (allInputElmtsValid(placeBidModalInputElmtNames)) {
            const placeBidForm = document.getElementById('placeBidForm');
            // eslint-disable-next-line no-undef
            const data = new FormData(placeBidForm);
            data.append('carID', currentlyLoadedCar);

            // Convert from FormData to JSON
            // https://stackoverflow.com/questions/41431322/how-to-convert-formdata-html5-object-to-json
            let dataJSON = JSON.stringify(Object.fromEntries(data));

            // Remove all unnecessary whitespace
            // https://stackoverflow.com/questions/7635952/javascript-how-to-remove-all-extra-spacing-between-words
            dataJSON = dataJSON.replace(/ +/g, '');

            // eslint-disable-next-line no-unused-vars
            const response = await fetch(endpointRoot + 'bids/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: dataJSON
            });

            const myModal = document.getElementById('btnPlaceBidModalClose');
            myModal.click();

            loadBidInfo(currentlyLoadedCar);
        }
    });

    btnViewBids.addEventListener('click', async function (event) {
        let data;

        // Make the GET request and handle errors
        try {
            console.log(endpointRoot + 'bids/' + currentlyLoadedCar);
            const response = await fetch(endpointRoot + 'bids/' + currentlyLoadedCar);
            data = await response.json();
        } catch (error) {
            if (error instanceof SyntaxError) {
                // Unexpected token < in JSON
                console.log('There was a SyntaxError', error);
            } else {
                showNetworkErrorModal();
            }
        }

        // Handle the case where data was fetched successfully
        if (data) {
            // Show the modal
            // eslint-disable-next-line no-undef
            const myModal = new bootstrap.Modal(document.getElementById('viewBidsModal'), {
                keyboard: false
                });
            myModal.show();

            const bidListElt = document.getElementById('bidList');
            bidListElt.innerHTML = '';

            if (Object.keys(data).length === 0) {
                const lblViewBidsModalNoBids = document.getElementById('lblViewBidsModalNoBids');
                lblViewBidsModalNoBids.classList.remove('visually-hidden');
            } else {
                const templateContent = document.getElementById('bidTemplate').content;

                // Create a card for each car in data
                for (const key in data) {
                    const bidData = data[key];

                    // Copy the HTML from the template in index.html
                    const copyHTML = document.importNode(templateContent, true);

                    // Modify each part in the template with the appropriate data

                    copyHTML.querySelector('.bidCardUser').textContent = bidData.user;
                    copyHTML.querySelector('.bidCardBid').textContent = '£' + bidData.bid;
                    copyHTML.querySelector('.bidCardTimestamp').textContent = timestampToString(bidData.timestamp);

                    // Append card to the card-layout
                    bidListElt.appendChild(copyHTML);
                }
            }
        }
    });

    btnPlaceBid.addEventListener('click', function (event) {
        clearPlaceBidModal();
    });
}

function clearPlaceBidModal () {
    for (let i = 0; i < placeBidModalInputElmtNames.length; i++) {
        // Get the specific DOM input element
        const elementString = 'validationModal' + placeBidModalInputElmtNames[i];
        const element = document.getElementById(elementString);

        // Clear value and reset validity feedback
        element.value = '';
        element.classList.remove('is-valid');
        element.classList.remove('is-invalid');
    }
}

function attachModalEventListeners() {
    attachValidationListeners();
    attachClearButtonListener();
    attachSubmitButtonListener();
}

function attachValidationListeners() {
    for (let i = 0; i < newCarModalInputElmtNames.length; i++) {
        // Get the specific DOM input element
        const elementString = 'validationModal' + newCarModalInputElmtNames[i];
        const element = document.getElementById(elementString);

        element.addEventListener('input', (event) => {
            checkInputElementValidity(element);
        });
    }

    for (let i = 0; i < placeBidModalInputElmtNames.length; i++) {
        // Get the specific DOM input element
        const elementString = 'validationModal' + placeBidModalInputElmtNames[i];
        const element = document.getElementById(elementString);

        element.addEventListener('input', (event) => {
            checkInputElementValidity(element);
        });
    }
}

// Changes the validity of a given input DOM element depending on its current value
function checkInputElementValidity(inputElmt) {
    // Determine which RegEx literal should be used depending on the id of the inputElmt
    let regex = '';
    switch (inputElmt.id) {
        case 'validationModalImage':
            regex = /^.+\.(png|jpg|jpeg|webp)$/;
            break;
        case 'validationModalMake':
        case 'validationModalColour':
        case 'validationModalUsername':
            regex = /^(?=\S)[A-Za-z\s]+$/;
            break;
        case 'validationModalModel':
            regex = /^(?=\S)[A-Za-z\d\s]+$/;
            break;
        case 'validationModalYear':
        case 'validationModalMileage':
            regex = /^\d+(,\d{3})*$/;
            break;
        case 'validationModalPrice':
        case 'validationModalBid':
            regex = /^\d+(,\d{3})*(\.\d{1,2})?$/;
            break;
        default:
            console.log('Unimplemented id: ', inputElmt.id);
    }

    const valid = regex.test(inputElmt.value.trim());

    if (valid) {
        inputElmt.classList.remove('is-invalid');
        inputElmt.classList.add('is-valid');
    } else {
        inputElmt.classList.remove('is-valid');
        inputElmt.classList.add('is-invalid');
    }

    return valid;
}

function allInputElmtsValid(InputElmtNames) {
    let counter = 0;
    for (let i = 0; i < InputElmtNames.length; i++) {
        // Get the specific DOM input element
        const elementString = 'validationModal' + InputElmtNames[i];
        const element = document.getElementById(elementString);

        if (checkInputElementValidity(element)) {
            counter++;
        }
    }

    return counter === InputElmtNames.length;
}

// Attaches on-click listener to the clear button in the modal
function attachClearButtonListener() {
    const btnClear = document.getElementById('btnModalClear');

    btnClear.addEventListener('click', (event) => {
        for (let i = 0; i < newCarModalInputElmtNames.length; i++) {
            // Get the specific DOM input element
            const elementString = 'validationModal' + newCarModalInputElmtNames[i];
            const element = document.getElementById(elementString);

            // Clear value and reset validity feedback
            element.value = '';
            element.classList.remove('is-valid');
            element.classList.remove('is-invalid');
        }
    });
}

async function attachSubmitButtonListener() {
    const btnSubmit = document.getElementById('btnModalSubmit');

    btnSubmit.addEventListener('click', async function (event) {
        if (allInputElmtsValid(newCarModalInputElmtNames)) {
            const newCarForm = document.getElementById('newCarForm');
            // eslint-disable-next-line no-undef
            const data = new FormData(newCarForm);

            // Convert from FormData to JSON
            // https://stackoverflow.com/questions/41431322/how-to-convert-formdata-html5-object-to-json
            let dataJSON = JSON.stringify(Object.fromEntries(data));
            console.log(dataJSON);

            // Remove all unnecessary whitespace
            // https://stackoverflow.com/questions/7635952/javascript-how-to-remove-all-extra-spacing-between-words
            dataJSON = dataJSON.replace(/ +/g, '');
            console.log(dataJSON);

            // eslint-disable-next-line no-unused-vars
            const response = await fetch(endpointRoot + 'cars/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: dataJSON
            });

            const myModal = document.getElementById('btnNewCarModalClose');
            myModal.click();

            loadCars();
        }
    });
}

// Purpose: Load all cars into card-layout when DOM loads
document.addEventListener('DOMContentLoaded', switchtoMainPage);

// Purpose: Attach on-click listeners to NavBar buttons
document.addEventListener('DOMContentLoaded', attachNavBarListeners);

// Purpose: Attach modal on-click event listeners
document.addEventListener('DOMContentLoaded', attachModalEventListeners);

// Purpose: Attach on-click listeners to OneCarView page
document.addEventListener('DOMContentLoaded', attachOneCarViewListeners);
