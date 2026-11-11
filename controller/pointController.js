const asynchandler = require('express-async-handler');
const processReceipt = require('./processRecipt');
const receiptValidator = require('./receiptValidator.js');
let dataDictionary = {}; // id of the recipt is mapped to the the Numeber of Points for that Reciept
const uuidv4  = require("uuid/v4");

/**
* This script contains two controller functions: processReceipts and getPoints.
* processReceipts handles the processing of a receipt, 
* validates its fields, calculates the receipt points based on certain criteria, 
* and stores the points in a data dictionary.
* getPoints retrieves the points associated with a receipt ID from the data dictionary.
*/

//@desc create a Receipts
// calculate the Recipt points.
//@route post/receipts/process
//@access public
const processReceipts = asynchandler(async (req, res)=>{
    const {retailer, purchaseDate, purchaseTime, items, total} = req.body;
    if(!retailer || !purchaseDate || !purchaseTime || !items || !total){
        res.status(400).json({"error":'All fields are required'});
        return;
    }
    let [validReciept, error] = receiptValidator.validateReceipt(retailer, purchaseDate, purchaseTime, items, total)
    if(!validReciept){
        res.status(400).json({"error":error});
        return;
    }
    let receiptPoint = processReceipt.countTotalAmount(retailer, purchaseDate, purchaseTime, items, total)
    let id = uuidv4()
    while(dataDictionary[id]){
        id = uuidv4()
    };
    dataDictionary[id] = receiptPoint;
    res.status(201).json({"id":id});
    return;
});

//@desc get a contact
//@route get/api/contacts/:id
//@access public
const getPoints = asynchandler(async (req, res)=>{
    if(!dataDictionary[req.params.id]){
        res.status(404).json('No receipt found for that id');
    }
    else{
        res.status(200).json({"points":dataDictionary[req.params.id]})
    };
    return;
});

module.exports = {getPoints, processReceipts}
