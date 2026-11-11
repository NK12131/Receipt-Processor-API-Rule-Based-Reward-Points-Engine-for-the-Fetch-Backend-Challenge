/**
 * This script sets up an Express server and listens on a specified port.It imports 
 * the receiptRoute.js script to handle the /receipts route.It uses the express.json 
 * middleware for parsing incoming JSON requests.It includes a basic error handling
 *  middleware.
 */

const express = require("express");
const dotenv = require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5001;
app.use(express.json());
app.use('/receipts', require('./routes/receiptRoute.js'));
app.use(require('./middleware/errorHandler.js'))
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})

module.exports = app;
