const fs = require("fs");
const path = require("path");

try {
  const private_key = fs.readFileSync(path.join(__dirname, ".private_key.txt"), "utf8");
  module.exports = {
    type: "service_account",
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key,
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ofr17%40api-stpharm.iam.gserviceaccount.com"
  };
} catch (error) {
  console.error("Error in permissions => ", error);
}
