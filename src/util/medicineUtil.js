// firestore
const db = require("../util/firebase");

/**
 * Function to know if a medicine is available, it is when its units are more than 0 and the date is earlier than the end date
 * @param {number} units The units of the specified medicine
 * @param {string} endDate The date when the medicine is unuseful in ISO format (YYYY-MM)
 * @returns True if units > 0 and current date is earlier than end date
 */
const isMedicineAvailable = (units, endDate) => {
  const currentDate = new Date();
  const finalDate = new Date(endDate);

  const currentTime = currentDate.getTime();
  const endTime = finalDate.getTime();

  // available
  if (units > 0 && currentTime < endTime) return true;

  //unavailable
  return false;
};

/**
 * Function to get the current units of the specified medicine
 * @param {string} userID The user id
 * @param {string} medicineID The medicine id
 * @returns The current medicine units integer
 */
const getCurrentUnits = async (userID, medicineID) => {
  try {
    const userRef = db.collection("users").doc(`${userID}`);
    const medicineRef = userRef.collection("medicines").doc(`${medicineID}`);

    // get current units
    const medicine = await medicineRef.get();
    const currentUnits = medicine.data().units;

    return currentUnits;
  } catch (error) {
    // send error
    console.error(error);
    throw "Can't get current units of the specified medicine";
  }
};

/**
 * Function to daily verify that the medicines of all users are available or not
 */
const dailyCheck = async () => {
  try {
    const usersRef = db.collection("users");
    const querySnapshot = await usersRef.get();

    // get user's id
    const usersID = querySnapshot.docs.map((user) => user.id);

    usersID.forEach(async (userID) => {
      const medicineRef = db.collection("users").doc(`${userID}`).collection("medicines");
      const querySnapshot = await medicineRef.get();

      // get medicine's id & units
      const medicines = await Promise.all(
        querySnapshot.docs.map(async (medicine) => {
          const { units, endDate, isAvailable } = medicine.data();
          const currentIsAvailable = isMedicineAvailable(units, endDate);
          if (isAvailable !== currentIsAvailable) {
            // isAvailable value CHANGE, update field!
            await medicineRef.doc(`${medicine.id}`).update({ isAvailable: currentIsAvailable });
          }
          return medicine.id;
        })
      );

      console.log(userID + " -> " + JSON.stringify(medicines));
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = { isMedicineAvailable, getCurrentUnits, dailyCheck };
