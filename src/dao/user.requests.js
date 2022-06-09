// firestore
const db = require("../util/firebase");

/**
 * Function to get the information of a specified user
 * @param {string} userID The user id
 * @returns An object of user type
 */
const getUserData = async (userID) => {
  try {
    const userRef = db.collection("users").doc(`${userID}`);
    // execute query
    const doc = await userRef.get();

    let user = {};
    if (!doc.exists) {
      return user;
    }

    user = { id: doc.id, ...doc.data() };

    // send data
    return user;
  } catch (error) {
    // send error
    console.error(error);
    throw "Can't get the user information";
  }
};

module.exports = { getUserData };
