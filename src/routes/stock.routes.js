const { Router } = require("express");
const router = Router();
// requests
const { searchMedicineByBarCode, substractUnits } = require("../dao/stock.requests");
const { getCurrentUnits } = require("../util/medicineUtil");
// util
const userExists = require("../util/userUtil");
const RoutesError = require("../util/RoutesError");
const RoutesMessage = require("../util/RoutesMessage");

/**
 * *********************************************************
 *                    EndPoint: stock                      *
 * *********************************************************
 */

/**
 * Method: GET
 * Obtain a medicine object searched by its codebar number
 *
 */
router.get("/api/stock/search", async (req, res) => {
  try {
    // get userID from authotization header
    const userID = req.get("authorization");
    // get barCode from query params
    const barCode = req.query.barCode;

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

    // validate that barCode query param was sent
    if (!barCode || barCode === undefined || barCode === "") {
      res.status(400).json(new RoutesError(400, "No barCode param specified"));
      return;
    }

    //search the medicine by its barCode
    const medicine = await searchMedicineByBarCode(userID, barCode);

    // send response
    res.status(200).json({ searchedMedicine: medicine });
  } catch (error) {
    // send error
    res.status(500).json(new RoutesError(500, "Can't get the specified medicine"));
    console.error(error);
  }
});

/**
 * Method: PUT
 * Update the medicine's units attribute by substracting the sold ones
 */
router.put("/api/stock/:medicineID", async (req, res) => {
  try {
    // get userID from authotization header
    const userID = req.get("authorization");
    // get medicineID param
    const medicineID = req.params.medicineID;
    // get units to substract
    const { unitsToSubstract } = req.body;

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

    // validate if medicineID is set
    if (!medicineID || medicineID === undefined) {
      res.status(400).json(new RoutesError(400, "No medicineID param specified"));
      return;
    }

    // validate if units to substract exists
    if (!unitsToSubstract || unitsToSubstract === undefined) {
      res.status(400).json(new RoutesError(400, "No unitsToSubstract param specified"));
      return;
    }

    // validate if current units are enough to substract
    if ((await getCurrentUnits(userID, medicineID)) < unitsToSubstract) {
      res.status(500).json(new RoutesError(500, "The specified units are more than the actual in stock"));
      return;
    }

    // substract units from stock of the specified medicine & verify if medicine is available
    await substractUnits(userID, medicineID, unitsToSubstract);

    // send response
    res.status(200).json(new RoutesMessage(200, "Units substracted successfully"));
  } catch (error) {
    // send error
    res.status(500).json(new RoutesError(500, "Can't substract units of the specified medicine"));
    console.log(error);
  }
});

module.exports = router;
