const express = require('express');
const bodyParser = require('body-parser');
const morgan = require("morgan");

const app = express();
const v1Router = require("./routes");
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api/v1", v1Router);


const start = async () => {
  try {
    app.listen(PORT, () => console.log(`app is listening on port ${PORT}...`));
  } catch (error) {
    console.log(error);
  }
};
start();
