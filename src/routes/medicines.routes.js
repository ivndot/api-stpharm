const { Router } = require("express");
const router = Router();
// requests
const {
  getAllMedicines,
  getAvailableMedicines,
  getUnavailableMedicines,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  getMedicine,
  searchMedicine,
} = require("../dao/medicines.requests");
// util
const { toLowerCase } = require("../util/util");
const { isMedicineAvailable } = require("../util/medicineUtil");
const RoutesError = require("../util/RoutesError");
const RoutesMessage = require("../util/RoutesMessage");
// user validation
const userExists = require("../util/userUtil");

/**
 * *********************************************************
 *                    EndPoint: medicines                  *
 * *********************************************************
 */

/**
 * Method: GET
 * Search a medicine by its:
 * -> Generic name
 * -> Commercial name
 * -> Lote
 */
router.get("/api/medicines/search", async (req, res) => {
  try {
    // get userID from authotization header
    const userID = req.get("authorization");
    // get med from query params
    const med = req.query.med;

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

    // validate that med query param was sent
    if (!med || med === undefined) {
      res.status(400).json(new RoutesError(400, "No med param specified"));
      return;
    }

    // get array of medicines that match the search
    const searchedMedicines = await searchMedicine(userID, med);

    // send response
    res.status(200).json({ searchedMedicines });
  } catch (error) {
    // send error
    res.status(500).json(new RoutesError(500, "Can't search medicine"));
    console.error(error);
  }
});

/**
 * Method: GET
 * Obtain all the medicines objects for the specified user
 * Query Params: availability = available/unavailable
 */
router.get("/api/medicines", async (req, res) => {
  try {
    // get userID from authorization header
    const userID = req.get("authorization");
    // get availability query param
    const availability = req.query.availability;

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

    let medicines = [];
    // the query parameter wasnt sent
    if (!availability || availability === undefined) {
      // get all medicines by default
      medicines = await getAllMedicines(userID);
      // send response
      res.status(200).json(medicines);
      return;
    }

    //the query param is set
    switch (availability) {
      case "available":
        medicines = await getAvailableMedicines(userID);
        break;
      case "unavailable":
        medicines = await getUnavailableMedicines(userID);
        break;
      default:
        medicines = await getAllMedicines(userID);
    }

    // send response
    res.status(200).json({ medicines });
  } catch (error) {
    //send response
    res.status(500).json(new RoutesError(500, "Can't get medicines"));
    console.error(error);
  }
});

/**
 * Method: GET
 * Obtain the information of the specified medicine
 */
router.get("/api/medicines/:medicineID", async (req, res) => {
  try {
    // get userID from authorization header
    const userID = req.get("authorization");
    // get medicineID param
    const medicineID = req.params.medicineID;

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

    // validate if medicineID is set
    if (!medicineID || medicineID === undefined) {
      res.status(400).json(new RoutesError(400, "No medicineID param specified"));
      return;
    }

    // get specified medicine
    const medicine = await getMedicine(userID, medicineID);

    // send response
    res.status(200).json({ medicine });
  } catch (error) {
    // send response
    res.status(500).json(new RoutesError(500, "Can't get the specified medicine"));
    console.error(error);
  }
});

/**
 * Method: POST
 * Add a new medicine to the database by creating a new collection of medicines
 */
router.post("/api/medicines", async (req, res) => {
  try {
    // get userID from authorization header
    const userID = req.get("authorization");
    // get the medicine object of the request body
    const medicine = req.body.medicine;

    //validate authentication header was sent
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

    // add new property
    medicine.isAvailable = isMedicineAvailable(medicine.units, medicine.endDate);
    // normalize medicine (make some properties lower case)
    const normalizedMedicine = {
      ...medicine,
      commercialName: toLowerCase(medicine.commercialName),
      dosageForm: toLowerCase(medicine.dosageForm),
      genericName: toLowerCase(medicine.genericName),
      wayOfAdministration: toLowerCase(medicine.wayOfAdministration),
    };
    // add new medicine
    await addMedicine(userID, normalizedMedicine);
    // send response
    res.status(200).json(new RoutesMessage(200, "Medicine registered successfully"));
  } catch (error) {
    //send response
    res.status(500).json(new RoutesError(500, "Can't create the new medicine"));
    console.error(error);
  }
});

/**
 * Method: PUT
 * Update or modify an specified medicine of a user
 */
router.put("/api/medicines/:medicineID", async (req, res) => {
  try {
    // get userID from authotization header
    const userID = req.get("authorization");
    // get medicineID from params
    const medicineID = req.params.medicineID;
    // get new medicine object
    const newMedicine = req.body.medicine;

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

    // add new property
    newMedicine.isAvailable = isMedicineAvailable(newMedicine.units, newMedicine.endDate);
    // normalize medicine (make some properties lower case)
    const normalizedMedicine = {
      ...newMedicine,
      commercialName: toLowerCase(newMedicine.commercialName),
      dosageForm: toLowerCase(newMedicine.dosageForm),
      genericName: toLowerCase(newMedicine.genericName),
      wayOfAdministration: toLowerCase(newMedicine.wayOfAdministration),
    };

    // update medicine
    await updateMedicine(userID, medicineID, normalizedMedicine);

    // send response
    res.status(200).json(new RoutesMessage(200, "Medicine updated successfully"));
  } catch (error) {
    // send response
    res.status(500).json(new RoutesError(500, "Can't update the medicine"));
    console.error(error);
  }
});

/**
 * Method: DELETE
 * Delete an specified medicine of a user
 */
router.delete("/api/medicines/:medicineID", async (req, res) => {
  try {
    // get userID from authotization header
    const userID = req.get("authorization");
    // get medicineID from params
    const medicineID = req.params.medicineID;

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

    // delete medicine
    await deleteMedicine(userID, medicineID);

    // send response
    res.status(200).json(new RoutesMessage(200, "Medicine deleted successfully"));
  } catch (error) {
    // send response
    res.status(500).json(new RoutesError(500, "Can't delete the medicine"));
    console.error(error);
  }
});

module.exports = router;
