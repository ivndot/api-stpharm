// firestore
const db = require("../util/firebase");

/**
 * Function to get all the outdated medicines
 * @param {string} userID The user id
 * @returns An array of medicine objects
 */
const getOutdatedMedicines = async (userID) => {
  try {
    const userRef = db.collection("users").doc(`${userID}`);
    const medRef = userRef.collection("medicines");

    // execute query
    const querySnapshot = await medRef.get();

    // filter outdated medicines
    const outDatedMedicines = querySnapshot.docs
      .filter((medicine) => {
        const { endDate } = medicine.data();
        const expirationDate = new Date(endDate);
        const currentDate = new Date();

        return currentDate.getTime() >= expirationDate.getTime();
      })
      .map((medicine) => ({ id: medicine.id, ...medicine.data() }));

    // send data
    return outDatedMedicines;
  } catch (error) {
    // send error
    console.error(error);
    throw "Can't get outdated medicines";
  }
};

/**
 * Function to get the medicines to expire in one month
 * @param {string} userID The user id
 * @returns An array of medicine objects
 */
const getOneMonthMedicinesToExpire = async (userID) => {
  try {
    const userRef = db.collection("users").doc(`${userID}`);
    const medRef = userRef.collection("medicines");

    // execute query
    const querySnapshot = await medRef.get();

    const oneMonthMedicinesToExpire = querySnapshot.docs
      .filter((medicine) => {
        const { endDate } = medicine.data();
        const expirationDate = new Date(endDate);
        const currentDate = new Date();

        const expirationYear = expirationDate.getFullYear();
        const currentYear = currentDate.getFullYear();
        const expirationMonth = expirationDate.getMonth();
        const currentMonth = currentDate.getMonth();
        const diffMonth = expirationMonth - currentMonth;

        return expirationYear === currentYear && diffMonth === 1;
      })
      .map((medicine) => ({ id: medicine.id, ...medicine.data() }));

    // send data
    return oneMonthMedicinesToExpire;
  } catch (error) {
    // send error
    console.error(error);
    throw "Can't get one month medicines to expire";
  }
};

/**
 * Function to get the medicines to expire in two months
 * @param {string} userID The user id
 * @returns An array of medicine objects
 */
const getTwoMonthsMedicinesToExpire = async (userID) => {
  try {
    const userRef = db.collection("users").doc(`${userID}`);
    const medRef = userRef.collection("medicines");

    // execute query
    const querySnapshot = await medRef.get();

    const twoMonthsMedicinesToExpire = querySnapshot.docs
      .filter((medicine) => {
        const { endDate } = medicine.data();
        const expirationDate = new Date(endDate);
        const currentDate = new Date();

        const expirationYear = expirationDate.getFullYear();
        const currentYear = currentDate.getFullYear();
        const expirationMonth = expirationDate.getMonth();
        const currentMonth = currentDate.getMonth();
        const diffMonth = expirationMonth - currentMonth;

        return expirationYear === currentYear && diffMonth === 2;
      })
      .map((medicine) => ({ id: medicine.id, ...medicine.data() }));

    // send data
    return twoMonthsMedicinesToExpire;
  } catch (error) {
    // send error
    console.error(error);
    throw "Can't get two months medicines to expire";
  }
};

/**
 * Function to get the medicines to expire in three or more months
 * @param {string} userID The user id
 * @returns An array of medicine objects
 */
const getThreeOrMoreMonthsMedicinesToExpire = async (userID) => {
  try {
    const userRef = db.collection("users").doc(`${userID}`);
    const medRef = userRef.collection("medicines");

    // execute query
    const querySnapshot = await medRef.get();

    const threeOrMoreMonthsMedicinesToExpire = querySnapshot.docs
      .filter((medicine) => {
        const { endDate } = medicine.data();
        const expirationDate = new Date(endDate);
        const currentDate = new Date();

        const expirationYear = expirationDate.getFullYear();
        const currentYear = currentDate.getFullYear();
        const expirationMonth = expirationDate.getMonth();
        const currentMonth = currentDate.getMonth();
        const diffMonth = expirationMonth - currentMonth;

        return expirationYear > currentYear || (expirationYear === currentYear && diffMonth >= 3);
      })
      .map((medicine) => ({ id: medicine.id, ...medicine.data() }));

    // send data
    return threeOrMoreMonthsMedicinesToExpire;
  } catch (error) {
    // send error
    console.error(error);
    throw "Can't get three or more months medicines to expire";
  }
};

module.exports = {
  getOutdatedMedicines,
  getOneMonthMedicinesToExpire,
  getTwoMonthsMedicinesToExpire,
  getThreeOrMoreMonthsMedicinesToExpire,
};
