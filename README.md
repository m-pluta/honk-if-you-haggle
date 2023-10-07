# Honk if you Haggle

This is my attempt at a responsive website designed using Bootstrap during university for buying used cars

I could not not find the CDN for the Bootstrap Bare template so thats why this project is 70% CSS

The template for this project was sourced from [Bootstrap Bare](https://startbootstrap.com/template/bare) under an MIT License

## Installation

Clone the repo and execute `npm i` in the terminal in the main directory

Then run `npm run start` in the terminal to launch the node server. The website should launch at http://127.0.0.1:8080

`npm run pretest` runs the linter (eslint) on the project
`npm run test` runs unit tests (jest) on the project

## Server
The server consists of `app.js` and `server.js`
- `app.js` implements all the endpoints for the API
- `server.js` starts the server on a specific project

The port used for this application is `8080`
The server should by default start (on Windows) at `http://127.0.0.1:8080/`

## Front end
The main HTML for the website is located in `client/index.html`
The main JS for the website is located in `client/assets/js/index.js`

## Database and entities
The JSON database is located in `db.json`
The two entities are cars and bids

## NPM script commands
The npm script commands to be used are:
- `npm install`
- `npm start`
- `npm pretest`
- `npm test`

## Extra info
IDs for all entities are generated using the UUIDv4 module

## API Documentation
[Postman API Documentation](https://documenter.getpostman.com/view/24580806/2s8ZDeTygV)

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change
