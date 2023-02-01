/* eslint-disable no-undef */
const request = require('supertest');
const app = require('./app');

// Information on how tests can be specified from: https://www.webtips.dev/webtips/jest/describe-vs-test-vs-it

// Import data from honk_if_you_haggle database
const fileNameForJSON = './honk_if_you_haggle_db.json';
const DbData = require(fileNameForJSON);

const carNotFound = { message: 'Car not found' };
const noBidsFound = { message: 'No bids found' };

// Test GET /cars endpoint
describe('GET /cars', () => {
    it('Should return a 200 status code', () => {
        return request(app)
        .get('/cars')
        .expect(200);
    });

    it('Should return JSON content-type', () => {
        return request(app)
        .get('/cars')
        .expect('Content-type', /json/);
    });

    it('Should return all the cars in the database', () => {
        return request(app)
        .get('/cars')
        .expect(DbData.cars);
    });

    // Test fetching all and should include - valid
});

// Test GET /cars/:id endpoint
describe('GET /cars/:id', () => {
    const testID = '73dc6baa-1699-4b12-b3df-febb78a20cd2';
    const nonExistentID = 'non-existent-ID';

    it('Should return a 200 status code', () => {
        return request(app)
            .get('/cars/' + testID)
            .expect(200);
    });

    it('Should return JSON content-type', () => {
        return request(app)
            .get('/cars/' + testID)
            .expect('Content-type', /json/);
    });

    it('Should return the correct car', () => {
        return request(app)
        .get('/cars/' + testID)
        .expect(DbData.cars[testID]);
    });

    it('Should return a 404 status code when ID specified is non-existent', () => {
        return request(app)
        .get('/cars/' + nonExistentID)
        .expect(404);
    });

    it('Should return a JSON content-type when ID specified is non-existent', () => {
        return request(app)
        .get('/cars/' + nonExistentID)
        .expect('Content-type', /json/);
    });

    it('Should return \'Car not found\' when ID specified is non-existent', () => {
        return request(app)
        .get('/cars/' + nonExistentID)
        .expect(carNotFound);
    });
});

// Test POST /cars endpoint
describe('POST /cars', () => {
    const params = {
        image: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/bentley-continental-gt-speed-2-1632854763.jpeg',
        make: 'Bentley',
        model: 'Continental GT',
        year: 2023,
        mileage: 500,
        color: 'silver',
        price: 200000
    };

    it('Should return a 200 status code', () => {
        return request(app)
        .post('/cars')
        .send(params)
        .expect(200);
    });

    it('Should return JSON content-type', () => {
        return request(app)
        .get('/cars')
        .send(params)
        .expect('Content-type', /json/);
    });

    // Should return the added car
    // Remove the added cars after each post
});

// Test GET /bids endpoint
describe('GET /bids', () => {
    it('Should return a 200 status code', () => {
        return request(app)
        .get('/bids')
        .expect(200);
    });

    it('Should return JSON content-type', () => {
        return request(app)
        .get('/bids')
        .expect('Content-type', /json/);
    });

    it('Should return all the bids in the database', () => {
        return request(app)
        .get('/bids')
        .expect(DbData.bids);
    });

    // Test fetching all and should include - valid
});

// Test GET /bids/:id endpoint
describe('GET /bids/:id', () => {
    const testID1 = '73dc6baa-1699-4b12-b3df-febb78a20cd2';
    const testID2 = '589cdccd-e046-4527-b218-5f4d84c31044';
    const nonExistentID = 'non-existent-ID';

    it('Should return a 200 status code', () => {
        return request(app)
            .get('/bids/' + testID1)
            .expect(200);
    });

    it('Should return JSON content-type', () => {
        return request(app)
            .get('/bids/' + testID1)
            .expect('Content-type', /json/);
    });

    // Test that it should return the correct bids when the ID specified exists for testID1

    it('Should return a 200 status code when ID specified exists, but corresponding car has no bids', () => {
        return request(app)
        .get('/bids/' + testID2)
        .expect(200);
    });

    it('Should return a JSON content-type when ID specified exists, but corresponding car has no bids', () => {
        return request(app)
        .get('/bids/' + testID2)
        .expect('Content-type', /json/);
    });

    it('Should return \'No bids found\' when ID specified exists, but corresponding car has no bids', () => {
        return request(app)
        .get('/bids/' + testID2)
        .expect(noBidsFound);
    });

    it('Should return a 404 status code when ID specified is non-existent', () => {
        return request(app)
        .get('/bids/' + nonExistentID)
        .expect(404);
    });

    it('Should return a JSON content-type when ID specified is non-existent', () => {
        return request(app)
        .get('/bids/' + nonExistentID)
        .expect('Content-type', /json/);
    });

    it('Should return \'Car not found\' when ID specified is non-existent', () => {
        return request(app)
        .get('/bids/' + nonExistentID)
        .expect(carNotFound);
    });
});

// Test GET /bids/:id/max endpoint
describe('GET /bids/:id/max', () => {
    const testID1 = '73dc6baa-1699-4b12-b3df-febb78a20cd2';
    const testID2 = '589cdccd-e046-4527-b218-5f4d84c31044';
    const nonExistentID = 'non-existent-ID';

    it('Should return a 200 status code', () => {
        return request(app)
            .get('/bids/' + testID1 + '/max')
            .expect(200);
    });

    it('Should return JSON content-type', () => {
        return request(app)
            .get('/bids/' + testID1 + '/max')
            .expect('Content-type', /json/);
    });

    // Test that it should return the correct bid when the ID specified exists for testID1

    it('Should return a 200 status code when ID specified exists, but corresponding car has no bids', () => {
        return request(app)
        .get('/bids/' + testID2 + '/max')
        .expect(200);
    });

    it('Should return a JSON content-type when ID specified exists, but corresponding car has no bids', () => {
        return request(app)
        .get('/bids/' + testID2 + '/max')
        .expect('Content-type', /json/);
    });

    it('Should return \'No bids found\' when ID specified exists, but corresponding car has no bids', () => {
        return request(app)
        .get('/bids/' + testID2 + '/max')
        .expect(noBidsFound);
    });

    it('Should return a 404 status code when ID specified is non-existent', () => {
        return request(app)
        .get('/bids/' + nonExistentID + '/max')
        .expect(404);
    });

    it('Should return a JSON content-type when ID specified is non-existent', () => {
        return request(app)
        .get('/bids/' + nonExistentID + '/max')
        .expect('Content-type', /json/);
    });

    it('Should return \'Car not found\' when ID specified is non-existent', () => {
        return request(app)
        .get('/bids/' + nonExistentID + '/max')
        .expect(carNotFound);
    });
});

// Test GET /bids/:id/num endpoint
describe('GET /bids/:id/num', () => {
    const testID1 = '73dc6baa-1699-4b12-b3df-febb78a20cd2';
    const testID2 = '589cdccd-e046-4527-b218-5f4d84c31044';
    const nonExistentID = 'non-existent-ID';

    it('Should return a 200 status code', () => {
        return request(app)
            .get('/bids/' + testID1 + '/num')
            .expect(200);
    });

    it('Should return JSON content-type', () => {
        return request(app)
            .get('/bids/' + testID1 + '/num')
            .expect('Content-type', /json/);
    });

    // Test that it should return the correct bid when the ID specified exists for testID1

    it('Should return a 200 status code when ID specified exists, but corresponding car has no bids', () => {
        return request(app)
        .get('/bids/' + testID2 + '/num')
        .expect(200);
    });

    it('Should return a JSON content-type when ID specified exists, but corresponding car has no bids', () => {
        return request(app)
        .get('/bids/' + testID2 + '/num')
        .expect('Content-type', /json/);
    });

    it('Should return \'No bids found\' when ID specified exists, but corresponding car has no bids', () => {
        return request(app)
        .get('/bids/' + testID2 + '/num')
        .expect(noBidsFound);
    });

    it('Should return a 404 status code when ID specified is non-existent', () => {
        return request(app)
        .get('/bids/' + nonExistentID + '/num')
        .expect(404);
    });

    it('Should return a JSON content-type when ID specified is non-existent', () => {
        return request(app)
        .get('/bids/' + nonExistentID + '/num')
        .expect('Content-type', /json/);
    });

    it('Should return \'Car not found\' when ID specified is non-existent', () => {
        return request(app)
        .get('/bids/' + nonExistentID + '/num')
        .expect(carNotFound);
    });
});

// Test POST /bids endpoint
describe('POST /bids', () => {
    const params = {
        user: 'Anonymous',
        bid: 12500,
        carID: '15d50423-4c09-402e-acb4-d6a170d3ed18'
    };

    it('Should return a 200 status code', () => {
        return request(app)
        .post('/bids')
        .send(params)
        .expect(200);
    });

    it('Should return JSON content-type', () => {
        return request(app)
        .get('/bids')
        .send(params)
        .expect('Content-type', /json/);
    });

    // Should return the added bid
    // Remove the added bids after each post
});