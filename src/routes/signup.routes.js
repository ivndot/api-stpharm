const { Router } = require("express");
const router = Router();
// requests
const signup = require("../dao/signup.requests");
// util
const { toLowerCase } = require("../util/util");
const RoutesError = require("../util/RoutesError");
const RoutesMessage = require("../util/RoutesMessage");

/**
 * *********************************************************
 *                    EndPoint: signup                     *
 * *********************************************************
 */

/**
 * Method: POST
 * Add a new user to the firestore database
 */
router.post("/api/signup", async (req, res) => {
  try {
    const user = req.body.user;
    // create user
    await signup({
      ...user,
      name: toLowerCase(user.name),
      lastName: toLowerCase(user.lastName),
      establishment: toLowerCase(user.establishment),
    });
    // send response
    res.status(200).json(new RoutesMessage(200, "The user was successfully registered"));
  } catch (error) {
    // send error
    res.status(500).json(new RoutesError(500, "There was an error register the user"));
    console.error(error);
  }
});

module.exports = router;
