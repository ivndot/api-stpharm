const { Router } = require("express");
const router = Router();
// requests
const {
  getOutdatedMedicines,
  getOneMonthMedicinesToExpire,
  getTwoMonthsMedicinesToExpire,
  getThreeOrMoreMonthsMedicinesToExpire,
} = require("../dao/control.requests");
// util
const userExists = require("../util/userUtil");
const RoutesError = require("../util/RoutesError");

/**
 * Method: GET
 * Get all the outdated medicines
 */
router.get("/api/control/outdated", async (req, res) => {
  try {
    // get userID from authotization header
    const userID = req.get("authorization");
    // get month query param
    const month = parseInt(req.query.month);

    //validate that the authentication header was sent
    if (!userID || userID === undefined) {
      res.status(401).json(new RoutesError(401, "No user specified"));
      return;
    }

    //validate that the user exists
    if (!(await userExists(userID))) {
      // send response
      res.status(401).json(new RoutesError(401, "The user does not exist"));
      return;
    }

    // validate that month param exists
    if (!month || month === undefined) {
      // get all outdated medicines
      const outDatedMedicines = await getOutdatedMedicines(userID);
      // send response
      res.status(200).json({ outDatedMedicines });
      return;
    }

    let medicinesToExpire = [];
    // for each month
    switch (month) {
      case 1:
        medicinesToExpire = await getOneMonthMedicinesToExpire(userID);
        break;
      case 2:
        medicinesToExpire = await getTwoMonthsMedicinesToExpire(userID);
        break;
      default:
        medicinesToExpire = await getThreeOrMoreMonthsMedicinesToExpire(userID);
        break;
    }

    // send response
    res.status(200).json({ medicinesToExpire });
  } catch (error) {
    // send error
    res.status(500).json(new RoutesError(500, "Can't get outdated medicines"));
    console.error(error);
  }
});

module.exports = router;
