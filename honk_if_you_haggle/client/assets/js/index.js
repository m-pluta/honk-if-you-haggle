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

    // Make fetch request and handle any network errors
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
            copyHTML.querySelector('.card-car-mileage').innerHTML = `<strong>Mileage: </strong> ${addCommasToNumbers(carData.mileage)}`;
            copyHTML.querySelector('.card-car-price').textContent = `£${addCommasToNumbers(carData.price)}`;
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
        const oneCarViewColor = document.getElementById('oneCarViewColor');
        const oneCarViewDate = document.getElementById('oneCarViewDate');

        // Name of the car
        const carFullName = capitalise(data.make + ' ' + data.model);
        oneCarViewCarTitle.innerText = carFullName;

        // Load image into the DOM
        oneCarViewImage.src = data.image;
        oneCarViewImage.alt = 'Image of ' + carFullName;

        // Specify the values of all the other text data fields
        oneCarViewBuyPrice.innerText = addCommasToNumbers(data.price);
        oneCarViewMake.innerText = capitalise(data.make);
        oneCarViewModel.innerText = capitalise(data.model);
        oneCarViewYear.innerText = data.year;
        oneCarViewMileage.innerText = addCommasToNumbers(data.mileage);
        oneCarViewColor.innerText = capitalise(data.color);
        oneCarViewDate.innerText = timestampToString(data.creation_date);

        // Load all the dynamic data about the bids on the car
        loadBidInfo(id);

        // Scroll the user to the top of the page on reload
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }
}

// Update the bid info on the OneCarView page
function loadBidInfo(id) {
    loadBidInfoMax(id);
    loadBidInfoNum(id);
}
// Update the DOM element which shows the current highest bid on a car listing
async function loadBidInfoMax(id) {
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
            oneCarViewBidPrice.innerText = '£' + addCommasToNumbers(data.bid);
        }
    } else if (response?.status === 404) {
        // 'Car not found'
    }
}
// Update the DOM element which shows the number of bids a car listing has
async function loadBidInfoNum(id) {
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

// Show a modal which tells the user that a network error occurred
function showNetworkErrorModal() {
    // eslint-disable-next-line no-undef
    const myModal = new bootstrap.Modal(document.getElementById('lostConnectionModal'), {});
    myModal.show();
}

// Switch from the OneCarView page to the mainWebsite
function switchtoMainPage() {
    // Get the body elements
    const mainWebsiteBody = document.getElementById('mainWebsiteBody');
    const oneCarViewBody = document.getElementById('oneCarViewBody');

    // Visually hide/unhide
    mainWebsiteBody.classList.remove('visually-hidden');
    oneCarViewBody.classList.add('visually-hidden');

    // Reload all the cars into the page
    loadCars();
}

// Switch from the mainWebsite page to the OneCarView page
function switchtoOneCarViewPage() {
    // Get the body elements
    const mainWebsiteBody = document.getElementById('mainWebsiteBody');
    const oneCarViewBody = document.getElementById('oneCarViewBody');

    // Visually hide/unhide
    mainWebsiteBody.classList.add('visually-hidden');
    oneCarViewBody.classList.remove('visually-hidden');
}

// Capitalises every word of a given input string
// Word: sequential characters separated by whitespace
function capitalise(str) {
    // Separate String into words
    const arr = str.split(' ');

    // Go through each word
    for (let i = 0; i < arr.length; i++) {
        // Capitalise the first character and attach the rest of the word
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }

    // Join the words back into a single string
    return arr.join(' ');
}

// Convert a timestamp (in milliseconds) to an equivalent human readable string
function timestampToString(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-UK') + ' ' + date.toLocaleTimeString('en-UK');
}

function addCommasToNumbers(number) {
    return number.toLocaleString('en-UK', { useGrouping: true });
}

// All the input DOM elements in the modals begin with validationModal
// These are the suffixes that go after this prefix
const newCarModalInputElmtNames = ['Image', 'Make', 'Model', 'Year', 'Mileage', 'Color', 'Price'];
const placeBidModalInputElmtNames = ['Username', 'Bid'];

// Add functionality such that
// if the user clicks on the website logo/brand name then they are navigated to the mainWebsite
function attachNavBarListeners() {
    const btnNavBarBrand = document.getElementById('btnNavBarBrand');
    btnNavBarBrand.addEventListener('click', (event) => {
        switchtoMainPage();
    });
}

// Parent function which attaches Event listeners
function attachModalEventListeners() {
    attachValidationListeners();
    attachClearButtonListener();
    attachSubmitButtonListener();
    attachCreateCarModalListener();
}

function attachValidationListeners() {
    // Add on-input-change validation to the newCarModal inputs
    for (let i = 0; i < newCarModalInputElmtNames.length; i++) {
        // Get the specific DOM element
        const elementString = 'validationModal' + newCarModalInputElmtNames[i];
        const element = document.getElementById(elementString);

        element.addEventListener('input', (event) => {
            // Update validity-feedback of element
            checkInputElementValidity(element);
        });
    }

    // Add on-input-change validation to the placeBidModal inputs
    for (let i = 0; i < placeBidModalInputElmtNames.length; i++) {
        // Get the specific DOM element
        const elementString = 'validationModal' + placeBidModalInputElmtNames[i];
        const element = document.getElementById(elementString);

        element.addEventListener('input', (event) => {
            // Update validity-feedback of element
            checkInputElementValidity(element);
        });
    }
}

// Changes the validity-feedback displayed to the user of a given input element depending on its current value
function checkInputElementValidity(inputElmt) {
    // Determine which RegEx literal should be used depending on the id of the inputElmt
    let regex;
    switch (inputElmt.id) {
        case 'validationModalImage':
            // A valid link ending in .png, .jpg, .jpeg, or .webp
            regex = /^.+\.(png|jpg|jpeg|webp)$/;
            break;
        case 'validationModalMake':
        case 'validationModalColor':
            // Cannot be only whitespace
            // Must be upper/lower case letters with whitespace
            regex = /^(?=\S)[A-Za-z\s]+$/;
            break;
        case 'validationModalModel':
        case 'validationModalUsername':
            // Cannot be only whitespace
            // Must be upper/lower case letters or numbers with whitespace
            regex = /^(?=\S)[A-Za-z\d\s]+$/;
            break;
        case 'validationModalYear':
        case 'validationModalMileage':
            // Must be numbers with optional commas separating the digits
            regex = /^\d+(,\d{3})*$/;
            break;
        case 'validationModalPrice':
        case 'validationModalBid':
            // Must be number in standard decimal format with 0, 1, or 2 decimal digits allowed, separated by commas
            regex = /^\d+(,\d{3})*(\.\d{1,2})?$/;
            break;
        default:
        // Supplied element has not been implemented yet
        // console.log('Unimplemented id: ', inputElmt.id);
    }

    // Validity is defaulted to false for security
    let valid = false;
    // If the supplied inputElmt has been implemented then safe to test the regex
    if (regex) {
        valid = regex.test(inputElmt.value.trim());
    }

    // Change the validity-feedback depending on the value of value
    if (valid) {
        inputElmt.classList.remove('is-invalid');
        inputElmt.classList.add('is-valid');
    } else {
        inputElmt.classList.remove('is-valid');
        inputElmt.classList.add('is-invalid');
    }

    // Return whether the supplied inputElmt is currently in a valid state
    return valid;
}

// Tests if the inputs in a given modal are valid. Returns true iff they are all valid
function allInputElmtsValid(InputElmtNames) {
    let counter = 0;
    for (let i = 0; i < InputElmtNames.length; i++) {
        // Get the specific DOM element
        const elementString = 'validationModal' + InputElmtNames[i];
        const element = document.getElementById(elementString);

        // Increase counter if element value is valid
        if (checkInputElementValidity(element)) {
            counter++;
        }
    }

    // Return true iff all are valid
    return counter === InputElmtNames.length;
}

// Attaches onClick listener to the clear button in the newCarModal
function attachClearButtonListener() {
    // Get reference to the clear button
    const btnClear = document.getElementById('btnModalClear');

    btnClear.addEventListener('click', (event) => {
        // Go through each input element in the modal
        for (let i = 0; i < newCarModalInputElmtNames.length; i++) {
            // Get the specific DOM element
            const elementString = 'validationModal' + newCarModalInputElmtNames[i];
            const element = document.getElementById(elementString);

            // Clear value and reset validity-feedback
            element.value = '';
            element.classList.remove('is-valid');
            element.classList.remove('is-invalid');
        }
    });
}

// Attaches onClick listener to the submit button in the newCarModal
async function attachSubmitButtonListener() {
    // Get reference to the submit button
    const btnSubmit = document.getElementById('btnModalSubmit');

    btnSubmit.addEventListener('click', async function (event) {
        // Test if the user's inputs are valid
        if (allInputElmtsValid(newCarModalInputElmtNames)) {
            // Create a FormData object to store all the user's inputs
            const newCarForm = document.getElementById('newCarForm');
            // eslint-disable-next-line no-undef
            const data = new FormData(newCarForm);

            // Remove all commas from number input
            data.set('year', data.get('year').replaceAll(',', ''));
            data.set('mileage', data.get('mileage').replaceAll(',', ''));
            data.set('price', data.get('price').replaceAll(',', ''));

            // Convert from FormData to JSON
            // Code from: https://stackoverflow.com/questions/41431322/how-to-convert-formdata-html5-object-to-json
            let dataJSON = JSON.stringify(Object.fromEntries(data));

            // Remove all unnecessary whitespace
            // Code from: https://stackoverflow.com/questions/7635952/javascript-how-to-remove-all-extra-spacing-between-words
            dataJSON = dataJSON.replace(/ +/g, '');

            // eslint-disable-next-line no-unused-vars
            const response = await fetch(endpointRoot + 'cars/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: dataJSON
            });

            // Close the modal
            const myModal = document.getElementById('btnNewCarModalClose');
            myModal.click();

            // Switch to other page and reload cars
            switchtoMainPage();
        }
    });
}

// Attach an onClick listener to the 'Create a car listing' option in the NavBar so that it opens the newCarModal when clicked
function attachCreateCarModalListener() {
    const btnCreateACarListing = document.getElementById('btnCreateACarListing');
    btnCreateACarListing.addEventListener('click', function (event) {
        // Show modal
        // eslint-disable-next-line no-undef
        const myModal = new bootstrap.Modal(document.getElementById('newCarModal'), {
            keyboard: false
        });
        myModal.show();

        // Clear the modal
        const btnClear = document.getElementById('btnModalClear');
        btnClear.click();
    });
}

function attachOneCarViewListeners() {
    attachModalPlaceBidListener();
    attachViewBidsListener();
    attachPlaceBidListener();
}

// Button for submitting/placing a bid on a car within the modal
function attachModalPlaceBidListener() {
    // Get reference to the button in the modal
    const btnModalPlaceBid = document.getElementById('btnModalPlaceBid');

    btnModalPlaceBid.addEventListener('click', async function (event) {
        // Check validity of input
        if (allInputElmtsValid(placeBidModalInputElmtNames)) {
            const placeBidForm = document.getElementById('placeBidForm');
            // eslint-disable-next-line no-undef
            const data = new FormData(placeBidForm);

            // Remove all commas from number input
            data.set('bid', data.get('bid').replaceAll(',', ''));

            // Append the car's ID to the bid
            data.append('carID', currentlyLoadedCar);

            // Convert from FormData to JSON
            // Code from: https://stackoverflow.com/questions/41431322/how-to-convert-formdata-html5-object-to-json
            let dataJSON = JSON.stringify(Object.fromEntries(data));

            // Remove all unnecessary whitespace
            // Code from: https://stackoverflow.com/questions/7635952/javascript-how-to-remove-all-extra-spacing-between-words
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

            // Reload the BidInfo since the bid placed may be the new maximum and the number of bids has increased
            loadBidInfo(currentlyLoadedCar);
        }
    });
}

// Button for displaying the viewBidsModal which shows all the current bids on a specific car
function attachViewBidsListener() {
    // Get reference to the button
    const btnViewBids = document.getElementById('btnViewBids');

    btnViewBids.addEventListener('click', async function (event) {
        let data, response;

        // Make fetch request and handle any network errors
        try {
            response = await fetch(endpointRoot + 'bids/' + currentlyLoadedCar);
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
            // Show the modal
            // eslint-disable-next-line no-undef
            const myModal = new bootstrap.Modal(document.getElementById('viewBidsModal'), {
                keyboard: false
            });
            myModal.show();

            // Clear the layout which stores all the bids displayed
            const bidListElt = document.getElementById('bidList');
            bidListElt.innerHTML = '';

            // Label which says there are no bids currently
            const lblViewBidsModalNoBids = document.getElementById('lblViewBidsModalNoBids');
            if (data?.message === 'No bids found') {
                // Show 'No bids yet' label if no bids were found on the server
                lblViewBidsModalNoBids.classList.remove('visually-hidden');
            } else {
                // Hide the 'No bids yet' label if bids were found on the server
                lblViewBidsModalNoBids.classList.add('visually-hidden');

                const templateContent = document.getElementById('bidTemplate').content;

                // Create a card for each bid
                for (const key in data) {
                    const bidData = data[key];

                    // Copy the HTML from the template
                    const copyHTML = document.importNode(templateContent, true);

                    // Modify each part in the template with the appropriate data
                    copyHTML.querySelector('.bidCardUser').textContent = bidData.user;
                    copyHTML.querySelector('.bidCardBid').textContent = '£' + addCommasToNumbers(bidData.bid);
                    copyHTML.querySelector('.bidCardTimestamp').textContent = timestampToString(bidData.timestamp);

                    // Append card to the Card Layout
                    bidListElt.appendChild(copyHTML);
                }
            }
        }
    });
}

// Attach onClick listener to the Place Bid button in the OneCarView page which clears the placeBidModal
// placeBidModal is opened another way
function attachPlaceBidListener() {
    const btnPlaceBid = document.getElementById('btnPlaceBid');

    btnPlaceBid.addEventListener('click', function (event) {
        clearPlaceBidModal();
    });
}

// Clears all the input fields in the placeBidModal
function clearPlaceBidModal() {
    for (let i = 0; i < placeBidModalInputElmtNames.length; i++) {
        // Get the specific DOM element
        const elementString = 'validationModal' + placeBidModalInputElmtNames[i];
        const element = document.getElementById(elementString);

        // Clear value and reset validity-feedback
        element.value = '';
        element.classList.remove('is-valid');
        element.classList.remove('is-invalid');
    }
}

// Do these when the DOM contents loads i.e. website loads
document.addEventListener('DOMContentLoaded', switchtoMainPage);
document.addEventListener('DOMContentLoaded', attachNavBarListeners);
document.addEventListener('DOMContentLoaded', attachModalEventListeners);
document.addEventListener('DOMContentLoaded', attachOneCarViewListeners);
