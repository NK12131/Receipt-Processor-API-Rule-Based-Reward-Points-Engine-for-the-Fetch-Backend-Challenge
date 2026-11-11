/** This script contains several helper functions that are used to calculate different 
* aspects of the receipt points.Each function performs a specific calculation based 
* on certain conditions or criteria defined in the requirements.The countTotalAmount
*  function utilizes these helper functions to calculate the total receipt points 
* based on the provided retailer, purchase date, purchase time, items, and total.
*/

/**
 * Calculates the number of points to be added based on the alphanumeric 
 * characters in the retailer name.
 *
 * @param {string} retailerName - The retailer name.
 * @returns {number} The number of points.
 */
function addRetailerName(retailerName) {
    let count = 0;
    for (let i = 0; i < retailerName.length; i++) {
      if (/[a-zA-Z0-9]/.test(retailerName[i])) {
        count++;
      }
    }
    return count;
  };
  
/**
 * Checks if the total amount is a round dollar amount without any cents.
 * If it is, adds 50 points; otherwise, adds 0 points.
 *
 * @param {string} total - The total amount on the receipt.
 * @returns {number} The number of points.
 */function addRoundDollarTotal(total) {
    let flag = false;
    if (/^\s*\d+(\.0+)?\s*$/.test(total)) {
       flag = true
      }
    return flag?50:0
  };
  
  
/**
 * Checks if the total amount is a multiple of 0.25.
 * If it is, adds 25 points; otherwise, adds 0 points.
 *
 * @param {string} total - The total amount on the receipt.
 * @returns {number} The number of points.
 */
function addMultiple025Total(total) {
    let flag = false;
    if (/^\d+(\.0+|\.25(0+)?|\.5(0+)?|\.75(0+)?)?$/.test(total)) {
       flag = true
      }
    return flag?25:0
  };
 
/**
 * Calculates the number of pairs of items on the receipt and adds 5 points for each pair.
 *
 * @param {Array} items - The array of items on the receipt.
 * @returns {number} The number of points.
 */
function addPairItems(items) {
    return Math.floor(items.length/2)*5
};

/**
 * Calculates the number of points to be added based on the trimmed length of each 
 * item description.If the trimmed length is a multiple of 3, multiplies the price 
 * by 0.2, rounds up to the nearest integer, and adds to the total points.
 * @param {Array} items - The array of items on the receipt.
 * @returns {number} The number of points.
 */
function addItemDescription(items) {
    let sum = 0;
    items.forEach(myFunction);
    function myFunction(item) {
        let str = item['shortDescription'];
        if(str && item['price']){
        let st = str.trim();
        if (st.length%3 === 0){
            sum += Math.ceil(parseFloat(item['price'])*0.2);
        }
    }
    };
    return sum
};

/**
 * Checks if the day in the purchase date is odd.
 * If it is, adds 6 points; otherwise, adds 0 points.
 *
 * @param {string} purchaseDate - The purchase date (YYYY-MM-DD).
 * @returns {number} The number of points.
 */
function addOddDate(purchaseDate) {
    const dateObj = new Date(purchaseDate + " " + "00:00:00");
    const curDay = dateObj.getDate(); // Extract the day component from the Date object
    return (curDay % 2 === 1)?6:0
};

/**
 * Checks if the purchase time is between 2:00 PM and 4:00 PM.
 * If it is, adds 10 points; otherwise, adds 0 points.
 *
 * @param {string} purchaseTime - The purchase time (HH:MM).
 * @returns {number} The number of points.
 */
function addPurchaseTime(purchaseTime) {
    const initialDate = '01/01/2011'
    const dateObj = Date.parse(initialDate + " " + purchaseTime);
    const time2 = Date.parse(initialDate + ' ' + '14:00:00')
    const time4 = Date.parse(initialDate + ' ' + '16:00:00')
    return (time2<dateObj && dateObj<time4)?10:0
};


/**
 * Count the total amount of receipt points.
 * @param {string} retailer - Retailer name.
 * @param {string} purchaseDate - Purchase date in the format 'YYYY-MM-DD'.
 * @param {string} purchaseTime - Purchase time in the format 'HH:MM'.
 * @param {Array} items - Array of purchased items.
 * @param {number} total - Total purchase amount.
 * @returns {number} Total receipt points.
 */
function countTotalAmount(retailer, purchaseDate, purchaseTime, items, total){
    let reciptPoint = 0;
    reciptPoint += addRetailerName(retailer);
    reciptPoint += addRoundDollarTotal(total);
    reciptPoint += addMultiple025Total(total);
    reciptPoint += addPairItems(items);
    reciptPoint += addOddDate(purchaseDate);
    reciptPoint += addPurchaseTime(purchaseTime);
    reciptPoint += addItemDescription(items);
    return reciptPoint;
};


module.exports = {countTotalAmount, addRetailerName, addRoundDollarTotal, addMultiple025Total, addPairItems, addOddDate, addPurchaseTime, addItemDescription};