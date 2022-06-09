//firestore
const db = require("./firebase");

/**
 * Function to validate if a user exist given its id
 * @param {string} userID The id of the firestore user
 * @returns True if user exist, False if not
 */
const userExists = async (userID) => {
  try {
    const userRef = db.collection("users").doc(`${userID}`);
    const docRef = await userRef.get();
    // user doesnt exists
    if (!docRef.exists) return false;
    // user exists
    return true;
  } catch (error) {
    // send response
    console.error(error);
    throw "Can't get user information";
  }
};

module.exports = userExists;
