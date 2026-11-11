# Fetch-Backend-Challenge-Node

This repository contains the backend code for the Fetch Backend Challenge implemented in Node.js.

## Using Docker

### Note:The below commands are for Linux/macOS environment

### Set Up

1. Install Docker by following the instructions in the official Docker documentation: [https://docs.docker.com/engine/install/](https://docs.docker.com/engine/install/).
2. Clone repository

```
git clone https://github.com/parthjain99/Fetch-backend-Parth-Jain.git
```

### Starting the server

1. Navigate to the directory where the Dockerfile is located.

   ```
   cd Fetch-backend-Parth-Jain
   ```
2. Build the Docker image by running the following command:

   ```
   docker build . -t node-fetch-backend
   ```
3. Run the Docker container with the following command:

   ```
   docker run -p 5001:5001 -d node-fetch-backend
   ```
4. The server should now be running and accessible on port 5001. You can access it using the following URL:

   ```
   http://localhost:5001/recipts
   ```

### Testing

1. Install frisby

   ```
   npm install frisby
   ```
2. Run unit tests with the following command:

   ```
   npm run test
   ```
3. To test the "POST" request for a receipt, you can use cURL with the following command:

   ```
   curl -H 'Content-Type: application/json' \
           -d '{
     "retailer": "Target",
     "purchaseDate": "2022-01-01",
     "purchaseTime": "13:01",
     "items": [
       {
         "shortDescription": "Mountain Dew 12PK",
         "price": "6.49"
       },{
         "shortDescription": "Emils Cheese Pizza",
         "price": "12.25"
       },{
         "shortDescription": "Knorr Creamy Chicken",
         "price": "1.26"
       },{
         "shortDescription": "Doritos Nacho Cheese",
         "price": "3.35"
       },{
         "shortDescription": "   Klarbrunn 12-PK 12 FL OZ  ",
         "price": "12.00"
       }
     ],
     "total": "35.35"
   }' \
         -X POST \
         http://localhost:5001/receipts/process
   ```
4. To get points for a specific ID, use the following cURL command:

   ```
   curl  http://localhost:5001/receipts/[id]/points
   ```

### Stop the server

1. Get the container ID by running the following command:

   ```
   docker ps
   ```
2. Kill the Docker container using the container ID with the following command:

   ```
   docker kill [container-id]
   ```

### What Each Script does.

1. controller/pointController.js:

   - This script contains two controller functions: `processReceipts` and `getPoints`.
   - `processReceipts` handles the processing of a receipt, validates its fields, calculates the receipt points based on certain criteria, and stores the points in a data dictionary.
   - `getPoints` retrieves the points associated with a receipt ID from the data dictionary.
2. controller/processReceipt.js:

   - This script contains several helper functions that are used to calculate different aspects of the receipt points.
   - Each function performs a specific calculation based on certain conditions or criteria defined in the requirements.
   - The `countTotalAmount` function utilizes these helper functions to calculate the total receipt points based on the provided retailer, purchase date, purchase time, items, and total.
3. controller/validateReceipt.js:

   - This script contains validation functions to check the validity of different fields in the receipt.
   - The functions validate the retailer name, total amount, item descriptions, purchase date, and purchase time.
   - The `validateall` function combines these individual validations and returns a validation result and an error message.
4. receiptRoute.js:

   - This script defines the routes for processing a receipt and retrieving the receipt points.
   - It uses the `processReceipts` and `getPoints` functions from the pointController.js script as route handlers.
5. server.js:

   - This script sets up an Express server and listens on a specified port.
   - It imports the receiptRoute.js script to handle the /receipts route.
   - It uses the express.json middleware for parsing incoming JSON requests.
   - It includes a basic error handling middleware.
6. APIUnitTest.js
   -This script contains unit tests for testing the functionality and behavior of the API endpoints using the Frisby library.It performs 20 tests.
