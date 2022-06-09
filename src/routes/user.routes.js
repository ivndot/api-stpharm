const { Router } = require("express");
const router = Router();
// requests
const { getUserData } = require("../dao/user.requests");
// util
const userExists = require("../util/userUtil");
const RoutesError = require("../util/RoutesError");

/**
 * Method: GET
 * Obtain the user logged information
 */
router.get("/api/user", async (req, res) => {
  try {
    // get userID from authorization header
    const userID = req.get("authorization");

    //validate authentication header was sent
    if (!userID || userID === undefined) {
      // send response
      res.status(401).json(new RoutesError(401, "No user specified"));
      return;
    }

    //validate that the user exists
    if (!(await userExists(userID))) {
      // send response
      res.status(401).json(new RoutesError(401, "The user does not exist"));
      return;
    }

    // get the user information
    const user = await getUserData(userID);

    // send response
    res.status(200).json({ user });
  } catch (error) {
    // send error
    res.status(500).json(new RoutesError(500, "Can't get user information"));
    console.error(error);
  }
});

module.exports = router;
