const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

//initialize express
const app = express();

/*
     ==============================================================
                            EXPRESS CONFIG                            
     ==============================================================
*/
// environment
const port = process.env.PORT || 3000;
// for application/json requests
app.use(bodyParser.json());
//cors
app.use(cors());

app.get("/", (req, res) => {
  res.send("StPharm API");
});

/*
     ==============================================================
                            ROUTES                            
     ==============================================================
*/
//signup
app.use(require("./src/routes/signup.routes"));

//medicines
app.use(require("./src/routes/medicines.routes"));

//stock
app.use(require("./src/routes/stock.routes"));

//control
app.use(require("./src/routes/control.routes"));

//user
app.use(require("./src/routes/user.routes"));

app.listen(port, () => {
  console.log("listening...");
});
