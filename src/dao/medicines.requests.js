//firestore
const db = require("../util/firebase");

/**
 * *********************************************************
 *             Requests for EndPoint: medicines            *
 * *********************************************************
 */

/**
 * Function to get the medicines of a specified user
 * @param {string} userID The userID of the specified user
 * @returns An array of medicines objects
 */
const getAllMedicines = async (userID) => {
  try {
    const userRef = db.collection("users").doc(`${userID}`);
    const medicineRef = userRef.collection("medicines");
    // execute query
    let querySnapshot = await medicineRef.get();

    // get data
    const medicines = querySnapshot.docs.map((medicine) => ({ id: medicine.id, ...medicine.data() }));

    // send medicines array
    return medicines;
  } catch (error) {
    // send error
    console.error(error);
    throw "Can't get the medicines";
  }
};

/**
 * Function to get the available medicines of a specified user
 * @param {string} userID The userID of the specified user
 * @returns An array of medicines objects
 */
const getAvailableMedicines = async (userID) => {
  try {
    const userRef = db.collection("users").doc(`${userID}`);
    const medicineRef = userRef.collection("medicines");
    // execute query
    const querySnapshot = await medicineRef.where("isAvailable", "==", true).get();

    // get data
    const medicines = querySnapshot.docs.map((medicine) => ({ id: medicine.id, ...medicine.data() }));

    // send medicines array
    return medicines;
  } catch (error) {
    // send error
    console.error(error);
    throw "Can't get the medicines";
  }
};

/**
 * Function to get the unavailable medicines of a specified user
 * @param {string} userID The userID of the specified user
 * @returns An array of medicines objects
 */
const getUnavailableMedicines = async (userID) => {
  try {
    const userRef = db.collection("users").doc(`${userID}`);
    const medicineRef = userRef.collection("medicines");
    // execute query
    const querySnapshot = await medicineRef.where("isAvailable", "==", false).get();

    // get data
    const medicines = querySnapshot.docs.map((medicine) => ({ id: medicine.id, ...medicine.data() }));

    // send medicines array
    return medicines;
  } catch (error) {
    // send error
    console.error(error);
    throw "Can't get the medicines";
  }
};

/**
 * Function to get a specified medicine of a user
 * @param {string} userID The user id
 * @param {string} medicineID The medicine if to obtain
 * @returns A medicine object
 */
const getMedicine = async (userID, medicineID) => {
  try {
    const userRef = db.collection("users").doc(`${userID}`);
    const medicineRef = userRef.collection("medicines").doc(`${medicineID}`);

    // execute query
    const docRef = await medicineRef.get();

    let medicine = {};
    if (docRef.exists) {
      // the medicine exists
      medicine = { id: docRef.id, ...docRef.data() };
    }

    // send data
    return medicine;
  } catch (error) {
    // send error
    console.error(error);
    throw "Can't get specified medicine";
  }
};

/**
 * Function to add a new medicine to the specified user
 * @param {string} userID The userID of the specified user
 * @param {object} medicine The medicine object to add
 */
const addMedicine = async (userID, medicine) => {
  try {
    const userRef = db.collection("users").doc(`${userID}`);
    //create a new doc with the medicine object
    await userRef.collection("medicines").doc().create(medicine);
  } catch (error) {
    // send error
    console.error(error);
    throw "Can't create a new medicine";
  }
};

/**
 * Function to update a specified medicine of a user
 * @param {string} userID The user id
 * @param {string} medicineID The medicine id to update
 * @param {object} newMedicine The medicine object containing the new information
 */
const updateMedicine = async (userID, medicineID, newMedicine) => {
  try {
    const userRef = db.collection("users").doc(`${userID}`);
    const medicineRef = userRef.collection("medicines").doc(`${medicineID}`);

    // execute query
    await medicineRef.update(newMedicine);
  } catch (error) {
    // send error
    console.error(error);
    throw "Can't update medicine";
  }
};

/**
 * Function to delete a specified medicine
 * @param {string} userID The user id
 * @param {string} medicineID The medicine id to delete
 */
const deleteMedicine = async (userID, medicineID) => {
  try {
    const userRef = db.collection("users").doc(`${userID}`);
    const medicineRef = userRef.collection("medicines").doc(`${medicineID}`);
    // execute query
    await medicineRef.delete();
  } catch (error) {
    //send error
    console.error(error);
    throw "Can't delete medicine";
  }
};

/**
 * Function to search a medicine by its `generic name` or `commercial name` or `lote`
 * @param {string} userID The user id
 * @param {string} query The query that user introduces
 * @returns An array of medicines or the medicine that match the query
 */
const searchMedicine = async (userID, query) => {
  try {
    const userRef = db.collection("users").doc(`${userID}`);
    const medicineRef = userRef.collection("medicines");

    // execute query
    const querySnapshot = await medicineRef.get();

    // get data
    const medicines = querySnapshot.docs.map((medicine) => ({ id: medicine.id, ...medicine.data() }));

    // filter medicines
    const filterMedicines = medicines.filter(
      (medicine) =>
        medicine.genericName.includes(query.toLowerCase()) ||
        medicine.commercialName.includes(query.toLowerCase()) ||
        medicine.lote === query
    );

    // send data
    return filterMedicines;
  } catch (error) {
    // send error
    console.error(error);
    throw "Can't search medicines";
  }
};

module.exports = {
  getAllMedicines,
  getAvailableMedicines,
  getUnavailableMedicines,
  getMedicine,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  searchMedicine,
};
