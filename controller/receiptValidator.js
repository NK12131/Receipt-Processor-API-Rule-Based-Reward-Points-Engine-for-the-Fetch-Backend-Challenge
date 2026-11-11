/** 
* This script contains validation functions to check the validity of different 
* fields in the receipt.The functions validate the retailer name, total amount, 
* item descriptions, purchase date, and purchase time.The validateall function 
* combines these individual validations and returns a validation result and an 
* error message.
*/

/**
 * Validate the retailer name.
 * @param {string} retailerName - Retailer name.
 * @returns {boolean} True if retailer name is valid, false otherwise.
 */
function validateRetailerName(retailerName) {
    return /^\S+/.test(retailerName);
  }

/**
 * Validate the total amount.
 * @param {number} total - Total purchase amount.
 * @returns {boolean} True if total amount is valid, false otherwise.
 */
function validateTotal(total) {
    return /^\d+\.\d{2}$/.test(total);
  };
 

/**
 * Validate the item description and price.
 * @param {Array} items - Array of purchased items.
 * @returns {boolean} True if item description and price are valid, false otherwise.
 */
function validateItemDescription(items) {
    if (items.length < 1){
        return false;
    }
    for(let i = 0; i < items.length; i++){
        item = items[i];
        if(!item['shortDescription'] || !item['price']){
            return false;
        }
        if (!/^[\w\s\-]+$/.test(item['shortDescription'])){
            return false;
        }
        if (!/^\d+\.\d{2}$/.test(item['price'])){
            return false;
        }
    };
    return true;
};

/**
 * Validate the date format.
 * @param {string} dateString - Date string in the format 'YYYY-MM-DD'.
 * @returns {boolean} True if date format is valid, false otherwise.
 */
function validateDate(dateString) {
    // First check for the pattern
    let regex_date = /^\d{4}\-\d{1,2}\-\d{1,2}$/;

    if(!regex_date.test(dateString))
    {
        return false;
    }

    // Parse the date parts to integers
    let parts =  dateString.split("-");
    let day   =  parseInt(parts[2], 10);
    let month =  parseInt(parts[1], 10);
    let year  =  parseInt(parts[0], 10);

    // Check the ranges of month and year
    if(year < 1000 || year > 3000 || month == 0 || month > 12)
    {
        return false;
    }

    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

    // Adjust for leap years
    if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
    {
        monthLength[1] = 29;
    }

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
}


/**
 * Validate the time format.
 * @param {string} timeString - Time string in the format 'HH:MM'.
 * @returns {boolean} True if time format is valid, false otherwise.
 */
function validatePurchaseTime(purchaseTime) {
    const pattern = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/
    return pattern.test(purchaseTime);
};

/**
 * Validate the entire receipt.
 * @param {Object} receipt - Receipt object to be validated.
 * @returns {Array} Array containing the validation result (true or false) and an error message (null if valid).
 */
function validateReceipt(retailer, purchaseDate, purchaseTime, items, total){
    if(!validateRetailerName(retailer)){
        return [false, "Invalid retailer name"];
    }
    if (!validateTotal(total)){
        return [false, "Invalid total amount"];
    }
    if (!validateItemDescription(items)){
        return [false, "Invalid item description or price"];
    }   
    if (!validateDate(purchaseDate)){
        return [false, "Invalid purchase date"];
    }
    if (!validatePurchaseTime(purchaseTime)){
        return [false, "Invalid purchase time"];
    }
    return [true, null];
}

module.exports = {validateReceipt};
