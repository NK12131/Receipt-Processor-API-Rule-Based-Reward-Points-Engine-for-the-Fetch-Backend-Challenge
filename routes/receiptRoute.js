const express = require("express");
const router = express.Router();
const {getPoints, processReceipts} = require("../controller/pointController.js");

/**
 * This script defines the routes for processing a receipt and retrieving the 
 * receipt points.It uses the processReceipts and getPoints functions from the 
 * pointController.js script as route handlers.
 */

/**
 * Route to process a receipt and calculate the receipt points.
 * @name POST /receipts/process
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
router.route('/process').post(processReceipts);


/**
 * Route to get the receipt points by ID.
 * @name GET /receipts/:id/points
 * @param {Object} req - Express request object containing the receipt ID as a route parameter.
 * @param {Object} res - Express response object.
 */
router.route('/:id/points').get(getPoints);


module.exports = router;