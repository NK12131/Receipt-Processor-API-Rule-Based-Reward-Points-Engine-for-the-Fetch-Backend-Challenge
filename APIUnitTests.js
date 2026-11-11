//This file contains unit tests for testing the functionality and 
//behavior of the API endpoints.

const frisby = require('frisby');
const Joi = frisby.Joi; // Frisby exports Joi for convenience on type assersions
// const app = require('./server');
describe('Posts', function () {
it ('Tests if the API returns the id for a valid receipt, and sends get request to recieve correct points', function () {
    const receipt = {
        retailer: 'Target',
        purchaseDate: '2022-01-01',
        purchaseTime: '13:01',
        items: [
          {
            shortDescription: 'Mountain Dew 12PK',
            price: '6.49'
          },
          {
            shortDescription: 'Emils Cheese Pizza',
            price: '12.25'
          },
          {
            shortDescription: 'Knorr Creamy Chicken',
            price: '1.26'
          },
          {
            shortDescription: 'Doritos Nacho Cheese',
            price: '3.35'
          },
          {
            shortDescription: 'Klarbrunn 12-PK 12 FL OZ',
            price: '12.00'
          }
        ],
        total: '35.35'
      };
  return frisby
    .post('http://localhost:5001/receipts/process', receipt)
    .expect('status', 201)
    .expect('jsonTypes',  {'id': Joi.string().required()})
    .then(function (res) { // res = FrisbyResponse object
    let postId = JSON.parse(res._body).id;    
    return frisby.get(`http://localhost:5001/receipts/${postId}/points`)
    .expect('status', 200)
    .expect('jsonTypes', {'points': 28});
});
});
it (' Tests if the POST API returns id and GET API returns the correct number of points for a valid receipt with a round dollar amount total.', function () {
    const receipt = {
        retailer: 'M&M Corner Market',
        purchaseDate: '2022-03-20',
        purchaseTime: '14:33',
        items: [
          {
            shortDescription: 'Gatorade',
            price: '2.25'
          },
          {
            shortDescription: 'Gatorade',
            price: '2.25'
          },
          {
            shortDescription: 'Gatorade',
            price: '2.25'
          },
          {
            shortDescription: 'Gatorade',
            price: '2.25'
          }
        ],
        total: '9.00'
      };
  return frisby
    .post('http://localhost:5001/receipts/process', receipt)
    .expect('status', 201)
    .expect('jsonTypes',  {'id': Joi.string().required()})
    .then(function (res) { // res = FrisbyResponse object
    let postId = JSON.parse(res._body).id;    
    return frisby.get(`http://localhost:5001/receipts/${postId}/points`)
    .expect('status', 200)
    .expect('jsonTypes', {'points': 109});
});
});
it ('Tests if the POST API returns id and GET API returns the correct number of points for a valid receipt with an odd purchase day and time between 2:00pm and 4:00pm.', function () {
    const receipt = {
        retailer: 'Grocery Store',
        purchaseDate: '2022-06-15',
        purchaseTime: '14:30',
        items: [
          {
            shortDescription: 'Apples',
            price: '1.99'
          },
          {
            shortDescription: 'Bananas',
            price: '0.99'
          },
          {
            shortDescription: 'Oranges',
            price: '2.49'
          }
        ],
        total: '5.47'
      };      
  return frisby
    .post('http://localhost:5001/receipts/process', receipt)
    .expect('status', 201)
    .expect('jsonTypes',  {'id': Joi.string().required()})
    .then(function (res) { // res = FrisbyResponse object
    let postId = JSON.parse(res._body).id;    
    return frisby.get(`http://localhost:5001/receipts/${postId}/points`)
    .expect('status', 200)
    .expect('jsonTypes', {'points': 34});
});
});
it ('Tests if the API returns invalid items error for a receipt with no items.', function () {
    const receipt = {
        retailer: 'Supermarket',
        purchaseDate: '2022-04-10',
        purchaseTime: '12:15',
        items: [],
        total: '0.00'
      };          
  return frisby
    .post('http://localhost:5001/receipts/process', receipt)
    .expect('status', 400)
    .expect('jsonTypes',  {'error': "Invalid item description or price"})
});
it ('Tests if the API returns the correct number of points for a receipt with a total that is a multiple of 0.25.', function () {
    const receipt = {
        retailer: 'Convenience Store',
        purchaseDate: '2022-08-05',
        purchaseTime: '16:45',
        items: [
          {
            shortDescription: 'Soda',
            price: '1.50'
          },
          {
            shortDescription: 'Chips',
            price: '1.75'
          },
          {
            shortDescription: 'Candy',
            price: '2.00'
          }
        ],
        total: '5.25'
      };         
  return frisby
    .post('http://localhost:5001/receipts/process', receipt)
    .expect('status', 201)
    .expect('jsonTypes',  {'id': Joi.string().required()})
    .then(function (res) { // res = FrisbyResponse object
    let postId = JSON.parse(res._body).id;    
    return frisby.get(`http://localhost:5001/receipts/${postId}/points`)
    .expect('status', 200)
    .expect('jsonTypes', {'points': 52});
});
});
it ('Tests if the API correctly calculates points for a receipt with a retailer name containing special characters.', function () {
    const receipt = {
        retailer: 'ABC & Co.',
        purchaseDate: '2022-05-10',
        purchaseTime: '10:00',
        items: [
          {
            shortDescription: 'Product 1',
            price: '5.99'
          },
          {
            shortDescription: 'Product 2',
            price: '7.99'
          }
        ],
        total: '13.98'
      };
        
  return frisby
    .post('http://localhost:5001/receipts/process', receipt)
    .expect('status', 201)
    .expect('jsonTypes',  {'id': Joi.string().required()})
    .then(function (res) { // res = FrisbyResponse object
    let postId = JSON.parse(res._body).id;    
    return frisby.get(`http://localhost:5001/receipts/${postId}/points`)
    .expect('status', 200)
    .expect('jsonTypes', {'points': 14});
});
});
it ('Tests if the API correctly handles a receipt with an empty purchase Date.', function () {
    const receipt = {
        retailer: 'Grocery Shop',
        purchaseDate: '',
        purchaseTime: '09:30',
        items: [
          {
            shortDescription: 'Item 1',
            price: '2.50'
          }
        ],
        total: '2.50'
      };
      
  return frisby
    .post('http://localhost:5001/receipts/process', receipt)
    .expect('status', 400)
    .expect('jsonTypes',  {'error': "All fields are required"}  )
});
it ('Tests if the API correctly calculates points for a receipt with only one item.', function () {
    const receipt = {
        retailer: 'Grocery Shop',
        purchaseDate: '2022-07-20',
        purchaseTime: '14:00',
        items: [
          {
            shortDescription: 'Product X',
            price: '9.99'
          }
        ],
        total: '9.99'
      };
         
  return frisby
    .post('http://localhost:5001/receipts/process', receipt)
    .expect('status', 201)
    .expect('jsonTypes',  {'id': Joi.string().required()})
    .then(function (res) { // res = FrisbyResponse object
    let postId = JSON.parse(res._body).id;    
    return frisby.get(`http://localhost:5001/receipts/${postId}/points`)
    .expect('status', 200)
    .expect('jsonTypes', {'points': 13});
});
});
it ('Tests if the API correctly handles a receipt with an empty retailer name.', function () {
    const receipt = {
        retailer: '',
        purchaseDate: '2022-09-15',
        purchaseTime: '09:30',
        items: [
          {
            shortDescription: 'Item 1',
            price: '2.50'
          }
        ],
        total: '2.50'
      };
      
  return frisby
    .post('http://localhost:5001/receipts/process', receipt)
    .expect('status', 400)
    .expect('jsonTypes',  {'error': "All fields are required"}  )
});
it ('Receipt with purchase day as an even number', function () {
    const receipt = {
        retailer: 'Supermarket',
        purchaseDate: '2022-03-06',
        purchaseTime: '17:45',
        items: [
          {
            shortDescription: 'Milk',
            price: '2.99'
          },
          {
            shortDescription: 'Bread',
            price: '1.99'
          }
        ],
        total: '4.98'
      };
      
  return frisby
    .post('http://localhost:5001/receipts/process', receipt)
    .expect('status', 201)
    .expect('jsonTypes',  {'id': Joi.string().required()})
    .then(function (res) { // res = FrisbyResponse object
    let postId = JSON.parse(res._body).id;    
    return frisby.get(`http://localhost:5001/receipts/${postId}/points`)
    .expect('status', 200)
    .expect('jsonTypes', {'points': 16});
});
});
it ('Receipt with total as a round dollar amount with no cents', function () {
    const receipt = {
        retailer: 'Electronics Store',
        purchaseDate: '2022-09-05',
        purchaseTime: '09:30',
        items: [
          {
            shortDescription: 'Product X',
            price: '5.99'
          }
        ],
        total: '6.00'
      };
      
  return frisby
    .post('http://localhost:5001/receipts/process', receipt)
    .expect('status', 201)
    .expect('jsonTypes',  {'id': Joi.string().required()})
    .then(function (res) { // res = FrisbyResponse object
    let postId = JSON.parse(res._body).id;    
    return frisby.get(`http://localhost:5001/receipts/${postId}/points`)
    .expect('status', 200)
    .expect('jsonTypes', {'points': 99});
});
});
it ('Receipt with non-numeric price', function () {
    const receipt = {
        retailer: 'Electronics Store',
        purchaseDate: '2022-09-05',
        purchaseTime: '09:30',
        items: [
          {
            shortDescription: 'Product X',
            price: 'ABC'
          }
        ],
        total: '6.00'
      };
      
  return frisby
    .post('http://localhost:5001/receipts/process', receipt)
    .expect('status', 400)
    .expect('jsonTypes',  {'error': "Invalid item description or price"})
});
it ('Tests if the API correctly handles a receipt with an invalid date format.', function () {
    const receipt = {
        retailer: 'Electronics Store',
        purchaseDate: '2022/09/05',
        purchaseTime: '09:30',
        items: [
          {
            shortDescription: 'Product X',
            price: '5.99'
          }
        ],
        total: '6.00'
      };
      
  return frisby
    .post('http://localhost:5001/receipts/process', receipt)
    .expect('status', 400)
    .expect('jsonTypes',  {'error': "Invalid purchase date"})
});
it ('Tests if the API correctly handles a receipt with an invalid time format.', function () {
    const receipt = {
        retailer: 'Electronics Store',
        purchaseDate: '2022-09-05',
        purchaseTime: '12:30 PM',
        items: [
          {
            shortDescription: 'Product X',
            price: '5.99'
          }
        ],
        total: '6.00'
      };
      
  return frisby
    .post('http://localhost:5001/receipts/process', receipt)
    .expect('status', 400)
    .expect('jsonTypes',  {'error': "Invalid purchase time"})
});
it ('Tests if the API correctly handles a receipt with an empty purchaseTime.', function () {
    const receipt = {
        retailer: 'Grocery Store',
        purchaseDate: '2022-09-15',
        purchaseTime: '',
        items: [
          {
            shortDescription: 'Item 1',
            price: '2.50'
          }
        ],
        total: '2.50'
      };
      
  return frisby
    .post('http://localhost:5001/receipts/process', receipt)
    .expect('status', 400)
    .expect('jsonTypes',  {'error': "All fields are required"}  )
});
it ('Tests if the API correctly validates a retailer name with leading whitespace.', function () {
    const receipt = {
        retailer: '   Grocery Store',
        purchaseDate: '2022-03-06',
        purchaseTime: '17:45',
        items: [
          {
            shortDescription: 'Milk',
            price: '2.99'
          },
          {
            shortDescription: 'Bread',
            price: '1.99'
          }
        ],
        total: '4.98'
      };
      
  return frisby
    .post('http://localhost:5001/receipts/process', receipt)
    .expect('status', 400)
    .expect('jsonTypes',  {'error': 'Invalid retailer name'})
});
it ('Tests if the API correctly validates a valid total.', function () {
    const receipt = {
        retailer: 'Grocery Store',
        purchaseDate: '2022-03-06',
        purchaseTime: '17:45',
        items: [
          {
            shortDescription: 'Milk',
            price: '2.99'
          },
          {
            shortDescription: 'Bread',
            price: '1.99'
          }
        ],
        total: '9.999'
      };
      
  return frisby
    .post('http://localhost:5001/receipts/process', receipt)
    .expect('status', 400)
    .expect('jsonTypes',  {'error': 'Invalid total amount'})
});
it ('Tests if the API correctly validates not existing purchase date', function () {
    const receipt = {
        retailer: 'Grocery Store',
        purchaseDate: '2023-13-45',
        purchaseTime: '17:45',
        items: [
          {
            shortDescription: 'Milk',
            price: '2.99'
          },
          {
            shortDescription: 'Bread',
            price: '1.99'
          }
        ],
        total: '9.99'
      };
      
  return frisby
    .post('http://localhost:5001/receipts/process', receipt)
    .expect('status', 400)
    .expect('jsonTypes',  {'error': 'Invalid purchase date'})
});
it ('Tests if the API correctly calculates the points when the trimmed length of the item description is a multiple of 3.', function () {
    const receipt = {
        retailer: 'Electronics Store',
        purchaseDate: '2022-09-05',
        purchaseTime: '09:30',
        items: [
          {
            shortDescription: '        Product X',
            price: '5.99'
          }
        ],
        total: '6.00'
      };
      
  return frisby
    .post('http://localhost:5001/receipts/process', receipt)
    .expect('status', 201)
    .expect('jsonTypes',  {'id': Joi.string().required()})
    .then(function (res) { // res = FrisbyResponse object
    let postId = JSON.parse(res._body).id;    
    return frisby.get(`http://localhost:5001/receipts/${postId}/points`)
    .expect('status', 200)
    .expect('jsonTypes', {'points': 99});
});
});
it ('Tests if the API correctly sends 404 when invalid short description is sent', function () {
    const receipt = {
        retailer: 'Electronics Store',
        purchaseDate: '2022-09-05',
        purchaseTime: '09:30',
        items: [
          {
            shortDescription: 'Invalid#$@',
            price: '5.99'
          }
        ],
        total: '6.00'
      };
      
  return frisby
    .post('http://localhost:5001/receipts/process', receipt)
    .expect('status', 400)
    .expect('jsonTypes',  {'error': 'Invalid item description or price'})
});
});
