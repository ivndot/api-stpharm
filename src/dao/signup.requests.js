//firestore
const db = require("../util/firebase");

/**
 * *********************************************************
 *             Requests for EndPoint: signup               *
 * *********************************************************
 */

/**
 * Funtion to register a user into the firestore database
 * @param {object} user The user object containing all the information
 */
const signup = async (user) => {
  try {
    await db.collection("users").doc(user.userID).create(user);
  } catch (error) {
    // send error
    console.error(error);
    throw "Can't create new user";
  }
};

module.exports = signup;
