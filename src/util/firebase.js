//firestore
const admin = require("firebase-admin");
const serviceAccount = require("../../permissions.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://api-stpharm.firebaseio.com",
});
const db = admin.firestore();

module.exports = db;
