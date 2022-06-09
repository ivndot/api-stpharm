//firestore
const db = require("../util/firebase");
// util
const { isMedicineAvailable } = require("../util/medicineUtil");

/**
 * *********************************************************
 *             Requests for EndPoint: stock                *
 * *********************************************************
 */

/**
 * Function to search a specific medicine by its barcode
 * @param {string} userID The user id
 * @param {string} barCode The barcode to search
 */
const searchMedicineByBarCode = async (userID, barCode) => {
  try {
    const userRef = db.collection("users").doc(`${userID}`);
    const medicinesRef = userRef.collection("medicines");

    // execute query
    const querySnapshot = await medicinesRef.where("barcode", "==", `${barCode}`).get();
    const medicine = querySnapshot.docs.map((medicine) => ({ id: medicine.id, ...medicine.data() }));

    // send data
    return medicine[0];
  } catch (error) {
    // send error
    console.error(error);
    throw "Can't search medicine by barcode";
  }
};

/**
 * Functio to substract the specified units of a medicine from the stock
 * @param {string} userID The user id
 * @param {string} medicineID The medicine id
 * @param {number} units The units to be substracted
 */
const substractUnits = async (userID, medicineID, units) => {
  try {
    const userRef = db.collection("users").doc(`${userID}`);
    const medicineRef = userRef.collection("medicines").doc(`${medicineID}`);

    // get current units
    const medicine = await medicineRef.get();
    const currentUnits = medicine.data().units;
    // get new units
    const newUnits = currentUnits - units;
    // verify if medicine is available
    const isAvailable = isMedicineAvailable(newUnits, medicine.data().endDate);

    // execute query
    await medicineRef.update({ units: newUnits, isAvailable });
  } catch (error) {
    // send error
    console.log(error);
    throw "Can't substract units from the specified medicine";
  }
};

module.exports = { searchMedicineByBarCode, substractUnits };
